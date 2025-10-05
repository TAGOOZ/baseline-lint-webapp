import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { storage } from '../storage';
import { encrypt, decrypt } from './encryption';
import { logSecurityEvent } from './security';

// Simple logging function
function log(message: string, source = "auth") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || '/auth/github/callback';

// Session configuration - NO DEFAULT ALLOWED
const SESSION_SECRET = process.env.SESSION_SECRET;

export interface GitHubUser {
  id: number;
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  accessToken: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  isAuthenticated: true;
}

export function setupPassport() {
  // Validate required environment variables
  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
  }
  
  if (SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long');
  }
  
  // GitHub OAuth is optional for now
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    log('GitHub OAuth not configured. Authentication will be disabled.', 'auth');
    return;
  }

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: ['read:user', 'repo'] // Request access to user info and repositories
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      log(`GitHub OAuth callback for user: ${profile.username}`, 'auth');
      
      const githubUser: GitHubUser = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.photos?.[0]?.value || '',
        accessToken
      };

      // Encrypt access token before storage
      const encryptedToken = encrypt(githubUser.accessToken);
      
      // Store or update user in database
      const user = await storage.createUser({
        githubId: githubUser.id,
        username: githubUser.username,
        displayName: githubUser.displayName,
        profileUrl: githubUser.profileUrl,
        avatarUrl: githubUser.avatarUrl || null,
        accessToken: encryptedToken
      });
      
      // Log successful authentication
      logSecurityEvent('USER_AUTHENTICATED', {
        userId: user.id,
        username: user.username,
        githubId: githubUser.id
      });

      return done(null, user);
    } catch (error) {
      log(`Error in GitHub OAuth callback: ${error}`, 'auth');
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          profileUrl: user.profileUrl,
          avatarUrl: user.avatarUrl,
          isAuthenticated: true
        } as AuthenticatedUser);
      } else {
        done(null, false);
      }
    } catch (error) {
      log(`Error deserializing user: ${error}`, 'auth');
      done(error, null);
    }
  });

  log('Passport configured with GitHub OAuth strategy', 'auth');
}

export function getSessionConfig() {
  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
  }
  
  return {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // Custom session name
    cookie: {
      secure: true, // Always secure for cross-domain cookies
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none' as const, // Allow cross-domain cookies
      // Don't set domain for cross-domain cookies
    }
  };
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ 
    message: 'Authentication required',
    requiresAuth: true 
  });
}

export function getCurrentUser(req: any): AuthenticatedUser | null {
  if (req.isAuthenticated()) {
    return req.user;
  }
  return null;
}

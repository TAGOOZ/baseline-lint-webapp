import { Router } from 'express';
import passport from 'passport';
import { getCurrentUser } from '../lib/auth';
import { getCSRFProtection, getStrictRateLimitConfig } from '../lib/security';
import { logSecurityEvent } from '../lib/security';

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

const router = Router();

// Apply strict rate limiting to auth routes
router.use(getStrictRateLimitConfig());

// GitHub OAuth login
router.get('/auth/github', passport.authenticate('github', {
  scope: ['read:user', 'repo']
}));

// GitHub OAuth callback - Return JWT token instead of using sessions
router.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.FRONTEND_URL + '/?error=auth_failed'
  }),
  (req, res) => {
    const user = req.user as any;
    
    if (!user || !user.jwtToken) {
      log('OAuth callback missing user or JWT token', 'auth');
      return res.redirect(process.env.FRONTEND_URL + '/?error=auth_failed');
    }

    log(`User ${user.username} logged in successfully`, 'auth');
    logSecurityEvent('JWT_TOKEN_GENERATED', { userId: user.id, username: user.username }, req);

    // Redirect with token in URL for client-side storage
    const redirectUrl = `${process.env.FRONTEND_URL}/?token=${user.jwtToken}&success=login`;
    res.redirect(redirectUrl);
  }
);

// Logout with CSRF protection
router.post('/auth/logout', getCSRFProtection(), (req, res, next) => {
  const user = getCurrentUser(req);
  
  req.logout((err) => {
    if (err) {
      logSecurityEvent('LOGOUT_ERROR', { error: err.message, userId: user?.id }, req);
      return next(err);
    }
    
    req.session.destroy((err) => {
      if (err) {
        logSecurityEvent('SESSION_DESTROY_ERROR', { error: err.message, userId: user?.id }, req);
        return next(err);
      }
      
      logSecurityEvent('USER_LOGGED_OUT', { userId: user?.id, username: user?.username }, req);
      res.clearCookie('sessionId'); // Use custom session name
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/auth/me', (req, res) => {
  const user = getCurrentUser(req);
  if (user) {
    res.json({
      user,
      isAuthenticated: true
    });
  } else {
    res.json({
      user: null,
      isAuthenticated: false
    });
  }
});

// Check authentication status
router.get('/auth/status', (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  res.json({
    isAuthenticated,
    user: isAuthenticated ? getCurrentUser(req) : null
  });
});

export default router;

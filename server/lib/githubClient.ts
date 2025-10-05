import { Octokit } from '@octokit/rest';
import { storage } from '../storage';
import { decrypt } from './encryption';
import { logSecurityEvent } from './security';

// Simple logging function
function log(message: string, source = "github") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

let connectionSettings: any;

async function getSystemAccessToken() {
  // First, try to use the configured GitHub PAT for unauthenticated users
  const githubPat = process.env.GITHUB_PAT;
  if (githubPat) {
    log('Using configured GitHub PAT for unauthenticated users', 'github');
    return githubPat;
  }

  // Fallback to Replit connector (for backward compatibility)
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    return null; // No system token available
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings) {
      return null;
    }

    const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;
    return accessToken || null;
  } catch (error) {
    log(`Error getting system GitHub token: ${error}`, 'github');
    return null;
  }
}

// Get GitHub client for authenticated user
export async function getUserGitHubClient(userId: number): Promise<Octokit> {
  const user = await storage.getUser(userId);
  if (!user || !user.accessToken) {
    throw new Error('User not found or no access token');
  }
  
  try {
    // Decrypt the access token
    const decryptedToken = decrypt(user.accessToken);
    return new Octokit({ auth: decryptedToken });
  } catch (error) {
    logSecurityEvent('TOKEN_DECRYPTION_FAILED', { userId }, undefined);
    throw new Error('Failed to decrypt user access token');
  }
}

// Get GitHub client for system (fallback)
export async function getSystemGitHubClient(): Promise<Octokit | null> {
  const accessToken = await getSystemAccessToken();
  if (!accessToken) {
    return null;
  }
  
  return new Octokit({ auth: accessToken });
}

// Legacy function for backward compatibility
export async function getUncachableGitHubClient(): Promise<Octokit> {
  const systemClient = await getSystemGitHubClient();
  if (systemClient) {
    return systemClient;
  }
  
  throw new Error('No GitHub access available. Please authenticate with GitHub first.');
}

// Get the best available GitHub client
export async function getBestGitHubClient(userId?: number): Promise<Octokit> {
  // Try user token first if userId is provided
  if (userId) {
    try {
      return await getUserGitHubClient(userId);
    } catch (error) {
      log(`User GitHub client failed, falling back to system: ${error}`, 'github');
    }
  }
  
  // Fallback to system token
  const systemClient = await getSystemGitHubClient();
  if (systemClient) {
    return systemClient;
  }
  
  // If no GitHub access is available, throw a more helpful error
  if (userId) {
    throw new Error('No GitHub access available. Please authenticate with GitHub first.');
  } else {
    throw new Error('GitHub repository analysis requires authentication. Please login with GitHub to analyze repositories.');
  }
}

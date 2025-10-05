# GitHub Authentication Implementation

This document explains the GitHub OAuth authentication system implemented in the Baseline Lint Webapp.

## Overview

The application now supports two modes of operation:

1. **Unauthenticated Mode** (Default)
   - Uses shared system GitHub API token
   - Rate limited to 5 requests per minute
   - Limited to public repositories

2. **Authenticated Mode** (GitHub OAuth)
   - Users authenticate with their own GitHub account
   - Uses user's personal GitHub API quota (5,000 requests/hour)
   - Can access private repositories (if user has access)
   - Higher rate limits (20 requests per minute)

## Architecture

### Backend Components

- **`server/lib/auth.ts`**: Passport.js GitHub OAuth strategy configuration
- **`server/routes/auth.ts`**: Authentication routes (login, logout, status)
- **`server/lib/githubClient.ts`**: GitHub client that supports both user and system tokens
- **`server/storage.ts`**: User storage with GitHub profile information
- **`shared/schema.ts`**: Updated user schema for GitHub authentication

### Frontend Components

- **`client/src/components/AuthButton.tsx`**: Login/logout button with user info
- **`client/src/components/AuthStatus.tsx`**: Authentication status indicator
- **`client/src/config/api.ts`**: API configuration with authentication support

## Authentication Flow

1. User clicks "Login with GitHub"
2. Redirects to GitHub OAuth authorization
3. User authorizes the application
4. GitHub redirects back with authorization code
5. Server exchanges code for access token
6. Server stores user profile and token
7. User session is established
8. API calls use user's GitHub token

## Rate Limiting

### Unauthenticated Users
- 5 requests per minute
- Shared system token quota
- Basic error messages

### Authenticated Users
- 20 requests per minute
- Personal GitHub API quota (5,000 requests/hour)
- Enhanced error messages with authentication prompts

## Security Features

- Secure session management with HTTP-only cookies
- CSRF protection via same-origin policy
- Secure cookie settings in production
- Token storage in server-side session only
- Proper logout with session destruction

## Environment Variables

### Required for Authentication
```bash
# GitHub OAuth App credentials
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
GITHUB_CALLBACK_URL=https://your-backend-url.railway.app/auth/github/callback

# Session security
SESSION_SECRET=your-secure-session-secret-change-in-production
```

## API Endpoints

### Authentication Routes
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - OAuth callback handler
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info
- `GET /auth/status` - Check authentication status

### Protected Routes
- `POST /api/analyze-repo` - Repository analysis (enhanced for authenticated users)

## User Experience

### Visual Indicators
- Authentication status card showing current mode
- User avatar and name when authenticated
- Clear rate limit information
- Login/logout buttons in header

### Progressive Enhancement
- Works without authentication (limited features)
- Encourages authentication for better experience
- Graceful fallback when authentication fails
- Clear messaging about benefits of authentication

## Development

### Local Development
1. Create GitHub OAuth App with callback: `http://localhost:5000/auth/github/callback`
2. Set environment variables in `.env`
3. Run both frontend and backend
4. Test authentication flow

### Testing
- Test both authenticated and unauthenticated modes
- Verify rate limiting works correctly
- Test logout functionality
- Verify session persistence

## Deployment Considerations

### Backend Deployment
- Set all required environment variables
- Ensure HTTPS for production (required by GitHub OAuth)
- Configure proper CORS settings
- Use secure session secrets

### Frontend Deployment
- Set `VITE_API_BASE_URL` to backend URL
- Ensure HTTPS for production
- Test authentication flow in production

## Troubleshooting

### Common Issues
1. **OAuth callback errors**: Check callback URL matches GitHub app settings
2. **Session issues**: Verify `SESSION_SECRET` is set and secure
3. **CORS errors**: Ensure frontend URL is properly configured
4. **Rate limiting**: Check if user is authenticated and using correct limits

### Debug Information
- Check browser network tab for authentication requests
- Verify session cookies are being set
- Check backend logs for authentication errors
- Test API endpoints directly

## Future Enhancements

- OAuth token refresh handling
- User preferences and settings
- Repository access management
- Analytics and usage tracking
- Team/organization support

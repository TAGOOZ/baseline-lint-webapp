# Deployment Guide

This guide explains how to deploy the Baseline Lint Webapp to Netlify (frontend) and a backend hosting service.

## Architecture

- **Frontend**: React app deployed to Netlify
- **Backend**: Express.js API deployed to Railway/Render/Heroku

## Backend Deployment

### Option 1: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the Node.js app and deploy
6. Set environment variables if needed
7. Copy the deployed URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. Go to [Render.com](https://render.com)
2. Sign up/login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Use these settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Deploy and copy the URL

### Option 3: Heroku

1. Install Heroku CLI
2. Run:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## Frontend Deployment (Netlify)

### Method 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the frontend:
   ```bash
   npm run build:client
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=client/dist/public
   ```

### Method 2: Git Integration

1. Go to [Netlify](https://netlify.com)
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build:client`
   - **Publish directory**: `client/dist/public`
6. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://your-app.railway.app`)

## Environment Variables

### Backend (Railway/Render/Heroku) - REQUIRED
- `NODE_ENV=production`
- `PORT=5000`
- `SESSION_SECRET=your-secure-session-secret-32-chars-min` ⚠️ **CRITICAL**
- `ENCRYPTION_KEY=your-encryption-key-32-chars-min` ⚠️ **CRITICAL**
- `GITHUB_CLIENT_ID=your-github-oauth-app-client-id`
- `GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret`
- `GITHUB_CALLBACK_URL=https://your-backend-url.railway.app/auth/github/callback`

### Frontend (Netlify)
- `VITE_API_BASE_URL=https://your-backend-url.railway.app`

### Security Requirements
⚠️ **CRITICAL**: Generate secure secrets before deployment:
```bash
# Generate session secret (32+ characters)
openssl rand -base64 32

# Generate encryption key (32+ characters)
openssl rand -base64 32
```

## GitHub OAuth Setup

Before deploying, you need to create a GitHub OAuth App:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Baseline Lint Webapp
   - **Homepage URL**: Your frontend URL (e.g., `https://your-app.netlify.app`)
   - **Authorization callback URL**: Your backend URL + `/auth/github/callback` (e.g., `https://your-backend.railway.app/auth/github/callback`)
4. Copy the Client ID and Client Secret
5. Add these to your backend environment variables

## Security Checklist

Before deploying to production:

- [ ] Generate secure `SESSION_SECRET` (32+ characters)
- [ ] Generate secure `ENCRYPTION_KEY` (32+ characters)
- [ ] Set all required environment variables
- [ ] Use HTTPS in production
- [ ] Verify GitHub OAuth app configuration
- [ ] Test authentication flow
- [ ] Monitor security logs
- [ ] Set up error monitoring

## Testing

1. Deploy the backend first and note the URL
2. Create GitHub OAuth App with the backend callback URL
3. Set all environment variables in your backend deployment
4. Update the `VITE_API_BASE_URL` in Netlify with your backend URL
5. Deploy the frontend
6. Test the application:
   - Verify unauthenticated users can analyze code (limited rate)
   - Verify GitHub login works
   - Verify authenticated users get higher rate limits
   - Test repository analysis with both authenticated and unauthenticated users
   - Verify security headers are present
   - Test rate limiting
   - Test CSRF protection on logout

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend URL is correctly set in the frontend environment variables.

### Build Failures
- Ensure all dependencies are listed in `package.json`
- Check that the build command works locally
- Verify Node.js version compatibility

### API Connection Issues
- Verify the backend is deployed and accessible
- Check that the `VITE_API_BASE_URL` environment variable is set correctly
- Ensure the backend API endpoints are working

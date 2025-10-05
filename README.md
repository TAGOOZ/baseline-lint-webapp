# Baseline Lint Webapp

A modern web application for checking CSS and JavaScript browser compatibility using the [baseline-lint](https://github.com/TAGOOZ/baseline-lint) library. Features a retro terminal-style interface with real-time code analysis and GitHub repository scanning capabilities.

## 🚀 Features

- **Real-time Code Analysis**: Analyze CSS and JavaScript code for browser compatibility issues
- **GitHub Repository Scanner**: Analyze entire repositories for compatibility problems
- **Modern UI**: Retro terminal-style interface with Monaco Editor integration
- **Authentication**: GitHub OAuth integration for personalized API quotas
- **Rate Limiting**: Smart rate limiting with different quotas for authenticated vs unauthenticated users
- **Security**: JWT-based authentication, encryption, and comprehensive security middleware

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Passport.js** for GitHub OAuth authentication
- **JWT** tokens for stateless authentication
- **Helmet** for security headers
- **Rate limiting** and CSRF protection
- **AES-256-GCM** encryption for sensitive data

### Deployment
- **Netlify** for frontend hosting
- **Render** for backend hosting
- **GitHub Actions** for CI/CD

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TAGOOZ/baseline-lint-webapp.git
cd baseline-lint-webapp

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Security
SESSION_SECRET=your-secure-session-secret-32-chars-minimum
ENCRYPTION_KEY=your-encryption-key-32-chars-minimum
JWT_SECRET=your-jwt-secret-32-chars-minimum

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback

# GitHub API
GITHUB_PAT=your-github-personal-access-token

# Frontend
FRONTEND_URL=http://localhost:5173
```

## 📖 Usage

### Code Analysis
1. Open the web application
2. Select language (CSS/JavaScript)
3. Paste or type your code in the Monaco Editor
4. Click "Analyze" to get compatibility results

### Repository Analysis
1. Login with GitHub (optional but recommended)
2. Enter a GitHub repository URL (e.g., `owner/repo`)
3. The app will scan all CSS/JS files and provide compatibility analysis

### Authentication Benefits
- **Unauthenticated**: 5 requests/minute (shared quota)
- **Authenticated**: 5,000 requests/hour (personal GitHub quota)

## 🏗️ Project Structure

```
baseline-lint-webapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── lib/                # Core libraries
│   ├── routes/             # API routes
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
└── docs/                   # Documentation
```

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication with secure tokens
- **Encryption**: AES-256-GCM encryption for sensitive data
- **Security Headers**: Helmet.js for comprehensive security headers
- **Rate Limiting**: Protection against abuse and DoS attacks
- **CSRF Protection**: Cross-site request forgery protection
- **Input Sanitization**: Protection against injection attacks
- **Security Logging**: Comprehensive security event logging

## 🚀 Deployment

### Netlify (Frontend)
```bash
npm run build:client
# Deploy dist/public to Netlify
```

### Render (Backend)
```bash
npm run build
# Deploy to Render with start command: npm start
```

See [README-DEPLOYMENT.md](README-DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [baseline-lint](https://github.com/TAGOOZ/baseline-lint) library
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](README-DEPLOYMENT.md)
- Review [security guidelines](SECURITY-COMPLIANCE.md)

---

**Made with ❤️ for the web development community**

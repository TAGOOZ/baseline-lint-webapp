import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// Security logging function
export function logSecurityEvent(event: string, details: any, req?: Request) {
  const timestamp = new Date().toISOString();
  const ip = req?.ip || req?.socket?.remoteAddress || 'unknown';
  const userAgent = req?.get('User-Agent') || 'unknown';
  
  console.log(`[SECURITY] ${timestamp} - ${event}`, {
    ip,
    userAgent,
    path: req?.path,
    method: req?.method,
    details
  });
}

// Environment validation
export function validateEnvironment() {
  const required = [
    'SESSION_SECRET',
    'GITHUB_CLIENT_ID', 
    'GITHUB_CLIENT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate session secret strength
  const sessionSecret = process.env.SESSION_SECRET!;
  if (sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long');
  }
  
  if (sessionSecret === 'your-session-secret-change-in-production') {
    throw new Error('SESSION_SECRET must be changed from default value');
  }
}

// Helmet configuration
export function getHelmetConfig() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.github.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for GitHub API compatibility
  });
}

// Rate limiting configurations
export function getRateLimitConfig() {
  // General API rate limit
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: req.ip }, req);
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      });
    }
  });
}

// Strict rate limit for sensitive endpoints
export function getStrictRateLimitConfig() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logSecurityEvent('STRICT_RATE_LIMIT_EXCEEDED', { ip: req.ip }, req);
      res.status(429).json({
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
      });
    }
  });
}

// CSRF protection (for API endpoints)
export function getCSRFProtection() {
  return csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    value: (req: Request) => {
      return req.headers['x-csrf-token'] as string;
    }
  });
}

// Request size limits
export function requestSizeLimits() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set body parser limits
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
      logSecurityEvent('REQUEST_TOO_LARGE', { 
        contentLength: req.headers['content-length'],
        maxSize 
      }, req);
      return res.status(413).json({
        error: 'Request entity too large',
        maxSize: '10MB'
      });
    }
    
    next();
  };
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove server header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
}

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize common attack patterns
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
}

// Security monitoring middleware
export function securityMonitoring(req: Request, res: Response, next: NextFunction) {
  // Log suspicious requests
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /javascript:/i, // JavaScript injection
  ];
  
  const url = req.url;
  const userAgent = req.get('User-Agent') || '';
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      logSecurityEvent('SUSPICIOUS_REQUEST', { 
        url, 
        userAgent,
        pattern: pattern.toString()
      }, req);
      break;
    }
  }
  
  next();
}

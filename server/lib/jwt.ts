import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET environment variable is required and must be at least 32 characters long.');
}

export interface JWTPayload {
  userId: number;
  username: string;
  githubId: number;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'baseline-lint-webapp',
    audience: 'baseline-lint-client'
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'baseline-lint-webapp',
      audience: 'baseline-lint-client'
    }) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

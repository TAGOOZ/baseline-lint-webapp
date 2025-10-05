import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const keyEnv = process.env.ENCRYPTION_KEY;
  
  if (!keyEnv) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  // If key is base64 encoded, decode it
  if (keyEnv.length === 44 && keyEnv.endsWith('=')) {
    return Buffer.from(keyEnv, 'base64');
  }
  
  // Otherwise, derive key from the string
  return crypto.scryptSync(keyEnv, 'salt', KEY_LENGTH);
}

// Encrypt sensitive data
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combine iv, authTag, and encrypted data
    const combined = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    
    return combined;
  } catch (error) {
    throw new Error(`Encryption failed: ${error}`);
  }
}

// Decrypt sensitive data
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}

// Hash passwords or tokens (one-way)
export function hash(text: string, salt?: string): string {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(text, usedSalt, 10000, 64, 'sha512');
  return `${usedSalt}:${hash.toString('hex')}`;
}

// Verify hashed text
export function verifyHash(text: string, hashedText: string): boolean {
  try {
    const [salt, hash] = hashedText.split(':');
    const hashToVerify = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512');
    return hashToVerify.toString('hex') === hash;
  } catch (error) {
    return false;
  }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Generate secure session ID
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Validate encryption key format
export function validateEncryptionKey(key: string): boolean {
  // Check if it's a valid base64 key (44 characters with padding)
  if (key.length === 44 && key.endsWith('=')) {
    try {
      Buffer.from(key, 'base64');
      return true;
    } catch {
      return false;
    }
  }
  
  // Check if it's a strong string key (at least 32 characters)
  return key.length >= 32;
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const JWT_EXPIRY = '24h';
const COOKIE_NAME = 'admin_token';

// Hash password for storage
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Verify password against hash
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload) {
  if (!JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Verify JWT token
export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
}

// Get auth cookie
export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Verify admin authentication (use in API routes)
export async function verifyAdmin() {
  const token = await getAuthCookie();

  if (!token) {
    return { authenticated: false, error: 'Not authenticated' };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }

  return { authenticated: true, admin: decoded };
}

// Middleware helper for protected API routes
export async function withAdminAuth(handler) {
  const auth = await verifyAdmin();

  if (!auth.authenticated) {
    return Response.json(
      { error: auth.error },
      { status: 401 }
    );
  }

  return handler(auth.admin);
}

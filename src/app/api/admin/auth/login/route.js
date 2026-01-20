import { createServerClient } from '@/lib/supabase';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Simple rate limiting (in production, use a proper rate limiter)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (attempts) {
    // Clean up old attempts
    const recentAttempts = attempts.filter(time => now - time < LOCKOUT_DURATION);

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      const oldestAttempt = recentAttempts[0];
      const timeRemaining = Math.ceil((LOCKOUT_DURATION - (now - oldestAttempt)) / 60000);
      return { allowed: false, timeRemaining };
    }

    loginAttempts.set(email, recentAttempts);
  }

  return { allowed: true };
}

function recordAttempt(email) {
  const attempts = loginAttempts.get(email) || [];
  attempts.push(Date.now());
  loginAttempts.set(email, attempts);
}

function clearAttempts(email) {
  loginAttempts.delete(email);
}

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit
    const rateLimit = checkRateLimit(normalizedEmail);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rateLimit.timeRemaining} minutes.` },
        { status: 429 }
      );
    }

    // Fetch admin user
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, name, role, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (error || !admin) {
      recordAttempt(normalizedEmail);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Contact super admin.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash);

    if (!isValidPassword) {
      recordAttempt(normalizedEmail);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Clear login attempts on success
    clearAttempts(normalizedEmail);

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

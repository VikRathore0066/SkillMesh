import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'skillmesh-super-secret-key-for-dev';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getUser(request) {
  let token;
  
  // Try Authorization header first
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  
  // Fallback to cookies
  if (!token) {
    try {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('token');
      if (tokenCookie) {
        token = tokenCookie.value;
      }
    } catch (e) {
      // cookies() might fail outside of request context
    }
  }
  
  if (!token) return null;
  
  return await verifyToken(token);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

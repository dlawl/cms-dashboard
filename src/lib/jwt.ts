import jwt from 'jsonwebtoken';

export function signJwt(payload: unknown) {
  return jwt.sign(payload as object, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
export function verifyJwt(token: string): unknown {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

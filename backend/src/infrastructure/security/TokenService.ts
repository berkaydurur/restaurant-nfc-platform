import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_OWNER';
  restaurantId?: string | null;
}

export class TokenService {
  private static readonly SECRET = process.env.JWT_SECRET || 'nfc-super-secret-key-production-ready-2026-clean-architecture';
  private static readonly EXPIRES_IN = '7d';

  public static sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRES_IN });
  }

  public static verify(token: string): TokenPayload {
    return jwt.verify(token, this.SECRET) as TokenPayload;
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';
import e, { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { SupabaseService } from 'src/shared/supabase/supabase.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}
  async use(req: Request, res: Response, next: () => void) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email, uid, name, picture } = decodedToken;
      // console.log(email, uid, name, picture);
      const { data, error } = await this.supabaseService.supabase
        .from('users')
        .select('*')
        .eq('id', uid);

      if (data===null || data.length === 0) {
        // If user does not exist, create a new user
       await this.supabaseService.supabase.from('users').upsert({
            id: uid,
            email: email,
            full_name: name,
            photoURL: picture,
          });
      }
      req['user'] = { email, uid };
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

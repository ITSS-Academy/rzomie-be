import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try{
      const decodedToken = await admin.auth().verifyIdToken(token)
      req['user'] = decodedToken;
      next();
    }
    catch(e){
      return res.status(401).json({ message: 'Invalid token' });
    }

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
}

// On étend le type Request pour ajouter notre user proprement
interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

@Injectable()
export class IsProfessionalMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET non défini dans .env');
      }

      const payload = jwt.verify(token, secret) as CustomJwtPayload;

      if (payload.role !== 'professionnel') {
        throw new ForbiddenException('Seuls les professionnels peuvent effectuer cette action');
      }

      req.user = payload; // ✅ On utilise maintenant le typage étendu

      next();
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}

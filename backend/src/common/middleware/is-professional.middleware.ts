import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface CustomJwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
}

interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

@Injectable()
export class IsProfessionalMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET non défini dans .env');
      }

      const payload = this.jwtService.verify<CustomJwtPayload>(token, { secret });

      console.log('Payload décodé:', payload);

      if (payload.role !== 'professionnel') {
        throw new ForbiddenException('Seuls les professionnels peuvent effectuer cette action');
      }

      req.user = payload;
      next();
    } catch (err) {
      console.log('Erreur lors de la vérification du token :', err);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}

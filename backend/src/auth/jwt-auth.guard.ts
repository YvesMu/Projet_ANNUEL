import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('JWT_SECRET');
    console.log('SECRET USED IN VERIFY ===>', secret);
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET manquant');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      request.user = payload; // On injecte l'utilisateur dans la requête
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }
}

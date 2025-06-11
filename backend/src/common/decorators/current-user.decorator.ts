import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CustomJwtPayload } from '../interfaces/custom-jwt-payload.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CustomJwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return request.user as CustomJwtPayload;
  },
);

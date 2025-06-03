import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomJwtPayload } from '../interfaces/custom-jwt-payload.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CustomJwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as CustomJwtPayload;
  },
);

import { Controller, Put, Get, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Body() update: { cvUrl?: string; presentation?: string; photoUrl?: string },
    @Req() req: Request & { user?: CustomJwtPayload }
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.updateProfile(userId, update);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.findById(userId);
  }
}

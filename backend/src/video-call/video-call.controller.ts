import { Controller, Post, Body, Get, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';

@Controller('video-call')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VideoCallController {
  constructor(private readonly videoCallService: VideoCallService) {}

  @Post('create')
  @Roles('professionnel')
  async createRoom(
    @Body('candidatId') candidatId: number,
    @Body('offreId') offreId: number,
    @CurrentUser() user: CustomJwtPayload,
  ) {
    return this.videoCallService.createRoom(candidatId, offreId, user.id);
  }

  @Get('my-calls')
  async getMyCalls(@CurrentUser() user: CustomJwtPayload) {
    return this.videoCallService.getCallsByUser(user.id);
  }

  @Get(':callId')
  async getRoom(@Param('callId', ParseIntPipe) callId: number) {
    return this.videoCallService.getRoomById(callId);
  }
}

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

  // ✅ Nouveau endpoint de planification
  @Post('schedule')
  @Roles('professionnel')
  async scheduleCall(
    @Body('candidatId') candidatId: number,
    @Body('offreId') offreId: number,
    @Body('scheduledAt') scheduledAt: string, // ex : 2025-06-05T14:00:00Z
    @CurrentUser() user: CustomJwtPayload,
  ) {
    return this.videoCallService.scheduleCall(candidatId, offreId, user.id, scheduledAt);
  }

  // ✅ Récupérer tous mes appels (pro ou particulier)
  @Get('my-calls')
  async getMyCalls(@CurrentUser() user: CustomJwtPayload) {
    return this.videoCallService.getCallsByUser(user.id);
  }

  // ✅ Récupérer un appel spécifique par ID
  @Get(':callId')
  async getRoom(@Param('callId', ParseIntPipe) callId: number) {
    return this.videoCallService.getRoomById(callId);
  }
}

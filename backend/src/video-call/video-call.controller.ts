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

  // ✅ Planifier un appel vidéo (nouveau endpoint clean)
  @Post('planifier')
  @Roles('professionnel')
  async planifier(
    @Body() body: { candidatId: number; offreId: number; scheduledAt: string },
    @CurrentUser() user: CustomJwtPayload,
  ) {
    return this.videoCallService.scheduleCall(
      body.candidatId,
      body.offreId,
      user.id,
      body.scheduledAt,
    );
  }

  // ✅ Récupérer les appels de l'utilisateur (pro ou candidat)
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

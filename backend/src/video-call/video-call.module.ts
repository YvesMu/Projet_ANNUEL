import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCall } from './video-call.entity';
import { VideoCallService } from './video-call.service';
import { VideoCallController } from './video-call.controller';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCall, User, Offre])],
  controllers: [VideoCallController],
  providers: [VideoCallService],
  exports: [VideoCallService],
})
export class VideoCallModule {}

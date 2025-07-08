import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCall } from './video-call.entity';
import { VideoCallService } from './video-call.service';
import { VideoCallController } from './video-call.controller';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';
import { VideoCallScheduler } from './video-call.scheduler';
import { MailerModule } from '../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCall, User, Offre]), MailerModule, AuthModule],
  controllers: [VideoCallController],
  providers: [VideoCallService, VideoCallScheduler, MailerModule],
  exports: [VideoCallService],
})
export class VideoCallModule {}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoCall } from './video-call.entity';
import { Repository } from 'typeorm';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class VideoCallScheduler {
  private readonly logger = new Logger(VideoCallScheduler.name);

  constructor(
    @InjectRepository(VideoCall)
    private readonly videoCallRepo: Repository<VideoCall>,

    private readonly mailerService: MailerService,
  ) {}

  // Chaque minute on vérifie les visios à venir
  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 5 * 60 * 1000); // 5min plus tard

    const upcomingCalls = await this.videoCallRepo.find({
      where: {
        scheduledAt: windowStart, // Peut être affiné avec une tolérance
      },
      relations: ['candidat', 'professionnel'],
    });

    for (const call of upcomingCalls) {
      await this.sendReminder(call);
    }
  }

  async sendReminder(call: VideoCall) {
    const message = `Votre appel vidéo est prévu dans quelques minutes. Rejoignez la salle ici : ${call.roomUrl}`;

    // ✅ Email pour le candidat
    await this.mailerService.sendGenericEmail(
      call.candidat.email,
      'Rappel visio planifiée',
      message,
    );

    // ✅ Email pour le professionnel
    await this.mailerService.sendGenericEmail(
      call.professionnel.email,
      'Rappel visio planifiée',
      message,
    );

    this.logger.log(`Rappel envoyé pour la visio ${call.id}`);
  }
}

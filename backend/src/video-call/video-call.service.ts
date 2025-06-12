import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoCall } from './video-call.entity';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';
import { MailerService } from '../mailer/mailer.service';
import * as dayjs from 'dayjs';

interface DailyRoomResponse {
  id: string;
  name: string;
  url: string;
}

@Injectable()
export class VideoCallService {
  constructor(
    @InjectRepository(VideoCall)
    private videoCallRepo: Repository<VideoCall>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Offre)
    private offreRepo: Repository<Offre>,

    private readonly mailerService: MailerService,
  ) {}

  async scheduleCall(
    candidatId: number,
    offreId: number,
    professionnelId: number,
    scheduledAt: string,
  ): Promise<VideoCall> {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    const url = 'https://api.daily.co/v1/rooms';

    let roomUrl: string;

    try {
      const response: AxiosResponse<DailyRoomResponse> = await axios.post(
        url,
        { properties: { exp: Math.floor(Date.now() / 1000) + 60 * 60 } },
        {
          headers: {
            Authorization: `Bearer ${DAILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      roomUrl = response.data.url;
    } catch (err: unknown) {
      console.error(err);
      throw new HttpException(
        'Erreur lors de la création de la room Daily',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const candidat = await this.userRepo.findOneBy({ id: candidatId });
    const professionnel = await this.userRepo.findOneBy({ id: professionnelId });
    const offre = await this.offreRepo.findOneBy({ id: offreId });

    if (!candidat || !professionnel || !offre) {
      throw new NotFoundException('Utilisateur ou Offre introuvable');
    }

    const videoCall = this.videoCallRepo.create({
      roomUrl,
      candidat,
      professionnel,
      offre,
      scheduledAt: new Date(scheduledAt),
    });

    const savedCall = await this.videoCallRepo.save(videoCall);

    // ✅ Format date et contenu de l’email
    const formatted = dayjs(scheduledAt).format('DD/MM/YYYY HH:mm');
    const message = `📅 Vous avez une visio prévue le ${formatted}.\n\n🔗 Lien : ${roomUrl}`;

    // 📨 Email immédiat au candidat
    await this.mailerService.sendGenericEmail(candidat.email, 'Visio programmée', message);

    // ⏰ Programmation du rappel 5 minutes avant
    const msUntilReminder = dayjs(scheduledAt).subtract(5, 'minute').diff(dayjs());

    if (msUntilReminder > 0) {
      setTimeout(() => {
        this.mailerService.sendGenericEmail(
          candidat.email,
          '⏰ Rappel - Visio dans 5 minutes',
          `Votre visio commence bientôt ! Voici le lien : ${roomUrl}`,
        );
      }, msUntilReminder);
    }

    return savedCall;
  }

  async getCallsByUser(userId: number): Promise<VideoCall[]> {
    return this.videoCallRepo.find({
      where: [{ candidat: { id: userId } }, { professionnel: { id: userId } }],
      relations: ['offre', 'candidat', 'professionnel'],
    });
  }

  async getRoomById(id: number): Promise<VideoCall> {
    const videoCall = await this.videoCallRepo.findOne({
      where: { id },
      relations: ['offre', 'candidat', 'professionnel'],
    });

    if (!videoCall) {
      throw new NotFoundException('Appel vidéo introuvable');
    }

    return videoCall;
  }
}

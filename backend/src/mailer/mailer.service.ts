import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/confirm-account?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmation de votre compte',
      text: `Bienvenue ! Cliquez ici pour confirmer votre compte : ${url}`,
      html: `<p>Bienvenue ! Cliquez ici pour confirmer votre compte :</p><p><a href="${url}">${url}</a></p>`,
    });
  }

  async sendGenericEmail(email: string, subject: string, content: string) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      text: content,
      html: `<p>${content}</p>`,
    });
  }
}

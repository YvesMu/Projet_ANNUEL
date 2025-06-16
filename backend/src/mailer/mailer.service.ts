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

  async sendResetPassword(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: '🔐 Réinitialisation de votre mot de passe',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Réinitialisation de votre mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        <p style="text-align: center;">
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
        <p><a href="${url}">${url}</a></p>
        <hr>
        <p style="font-size: 0.9em; color: #999;">Si vous n’avez pas demandé cette réinitialisation, ignorez ce message.</p>
      </div>
    `,
      text: `Réinitialisez votre mot de passe : ${url}`,
    });
  }
}

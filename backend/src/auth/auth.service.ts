import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('bcrypt:', bcrypt);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      prenom: registerDto.prenom,
      nom: registerDto.nom,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      typeOffre: registerDto.typeOffre,
      domaine: registerDto.domaine,
    });

    const payload = { id: user.id, email: user.email, username: user.prenom + ' ' + user.nom };
    const token = this.jwtService.sign(payload);

    await this.mailerService.sendUserConfirmation(user.email, token);

    return { message: 'Utilisateur créé avec succès', user };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email incorrect');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      prenom: user.prenom,
      nom: user.nom,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async confirmAccount(token: string) {
    try {
      const payload = this.jwtService.verify<{ id: string }>(token);

      await this.userService.confirmUser(Number(payload.id));

      return { message: 'Votre compte a été confirmé avec succès !' };
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    await this.mailerService.sendResetPassword(user.email, token);
    return { message: 'Un email de réinitialisation a été envoyé' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify<{ id: number }>(token);
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userService.updateProfile(payload.id, { password: hashed });
      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch {
      throw new BadRequestException('Token invalide ou expiré');
    }
  }
}

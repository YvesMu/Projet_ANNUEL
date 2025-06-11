import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('bcrypt:', bcrypt);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      typeOffre: registerDto.typeOffre,
      domaine: registerDto.domaine,
    });

    const payload = { id: user.id, email: user.email };
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

    const payload = { id: user.id, email: user.email, role: user.role };
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
}

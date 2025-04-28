import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async register(userData: {
    email: string;
    password: string;
    role: 'particulier' | 'professionnel';
    typeOffre: string;
    domaine: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      typeOffre: userData.typeOffre,
      domaine: userData.domaine,
    });

    await this.userRepository.save(user);

    return { message: 'Utilisateur créé avec succès' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRES_IN');

    const token = jwt.sign(payload, secret, { expiresIn });

    return { token };
  }
}

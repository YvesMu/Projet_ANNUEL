import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'prenom', 'nom', 'domaine'],
    });
    return user || undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async confirmUser(id: number): Promise<void> {
    await this.userRepository.update(id, { isConfirmed: true });
  }

  // async updateProfile(userId: number, update: Partial<User>) {
  //   // S’il y a un fichier photo, on construit l’URL complète
  //   if (update.photoUrl && !update.photoUrl.startsWith('http')) {
  //     const backendUrl = this.configService.get<string>('BACKEND_URL');
  //     update.photoUrl = `${backendUrl}/uploads/profile/${update.photoUrl}`;
  //   }

  //   await this.userRepository.update(userId, update);
  //   return this.userRepository.findOneBy({ id: userId });
  // }

  async updateProfile(userId: number, update: Partial<User>) {
    // S'il y a un fichier photo, on construit l'URL complète
    if (update.photoUrl && !update.photoUrl.startsWith('http')) {
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      update.photoUrl = `${backendUrl}/uploads/profile/${update.photoUrl}`;
    }

    // S'il y a un fichier CV, on construit l'URL complète
    if (update.cvUrl && !update.cvUrl.startsWith('http')) {
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      update.cvUrl = `${backendUrl}/uploads/cv/${update.cvUrl}`;
    }

    await this.userRepository.update(userId, update);
    return this.userRepository.findOneBy({ id: userId });
  }
  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Construire l'URL complète pour la photo si elle existe
    if (user.photoUrl && !user.photoUrl.startsWith('http')) {
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      user.photoUrl = `${backendUrl}/uploads/profile/${user.photoUrl}`;
    }

    // Construire l'URL complète pour le CV si elle existe
    if (user.cvUrl && !user.cvUrl.startsWith('http')) {
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      user.cvUrl = `${backendUrl}/uploads/cv/${user.cvUrl}`;
    }

    return user;
  }

  async getAllCandidats(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'particulier' },
      select: ['id', 'prenom', 'nom', 'email', 'photoUrl'],
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'prenom', 'nom', 'email', 'photoUrl', 'role'],
    });
  }
}

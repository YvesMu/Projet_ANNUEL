import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async confirmUser(id: number): Promise<void> {
    await this.userRepository.update(id, { isConfirmed: true });
  }

  async updateProfile(userId: number, update: Partial<User>) {
  await this.userRepository.update(userId, update);
  return this.userRepository.findOneBy({ id: userId });
  }

  async findById(userId: number): Promise<User> {
  const user = await this.userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  return user;
}


}
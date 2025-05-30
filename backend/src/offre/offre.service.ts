import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offre } from './offre.entity';
import { CreateOffreDto } from './dto/create-offre.dto';
import { User } from '../user/user.entity';

@Injectable()
export class OffreService {
  constructor(
    @InjectRepository(Offre)
    private offreRepository: Repository<Offre>,
  ) {}

  async create(createOffreDto: CreateOffreDto, auteur: User): Promise<Offre> {
    const offre = this.offreRepository.create({ ...createOffreDto, auteur });
    return await this.offreRepository.save(offre);
  }

  async findAll(): Promise<Offre[]> {
    return this.offreRepository.find({ relations: ['auteur'] });
  }
}

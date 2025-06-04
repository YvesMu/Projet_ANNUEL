import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulation } from './postulation.entity';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';
import { PostulationStatus } from './postulation.entity';

@Injectable()
export class PostulationService {
  constructor(
    @InjectRepository(Postulation) private postulationRepo: Repository<Postulation>,
    @InjectRepository(Offre) private offreRepo: Repository<Offre>,
  ) {}

  async create(dto: CreatePostulationDto, candidat: User): Promise<Postulation> {
    const offre = await this.offreRepo.findOneBy({ id: dto.offreId });
    if (!offre) {
      throw new NotFoundException('Offre non trouvée');
    }

    const postulation = this.postulationRepo.create({ candidat, offre });
    return this.postulationRepo.save(postulation);
  }

  async findByUser(userId: number): Promise<Postulation[]> {
    return this.postulationRepo.find({
      where: { candidat: { id: userId } },
      relations: ['offre'],
    });
  }

  async updateStatus(id: number, status: PostulationStatus): Promise<Postulation> {
    const postulation = await this.postulationRepo.findOne({ where: { id } });
    if (!postulation) throw new Error('Postulation introuvable');
    postulation.status = status;
    return this.postulationRepo.save(postulation);
  }

  async findAllWithRelations(): Promise<Postulation[]> {
    return this.postulationRepo.find({
      relations: ['offre', 'candidat'],
    });
  }
}

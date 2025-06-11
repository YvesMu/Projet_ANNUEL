import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulation } from './postulation.entity';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';
import { PostulationStatus } from './postulation.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class PostulationService {
  constructor(
    @InjectRepository(Postulation) private postulationRepo: Repository<Postulation>,
    @InjectRepository(Offre) private offreRepo: Repository<Offre>,
    private readonly mailerService: MailerService,
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
    const postulation = await this.postulationRepo.findOne({
      where: { id },
      relations: ['candidat', 'offre'],
    });
    if (!postulation) throw new Error('Postulation introuvable');

    postulation.status = status;
    const updated = await this.postulationRepo.save(postulation);

    await this.sendStatusUpdateEmail(postulation.candidat, postulation.offre, status);
    return updated;
  }

  async findAllWithRelations(): Promise<Postulation[]> {
    return this.postulationRepo.find({
      relations: ['offre', 'candidat'],
    });
  }

  async getAllPostulations(): Promise<Postulation[]> {
    return this.postulationRepo.find({
      relations: ['candidat', 'offre'],
    });
  }

  private async sendStatusUpdateEmail(candidat: User, offre: Offre, status: PostulationStatus) {
    await this.mailerService.sendGenericEmail(
      candidat.email,
      'Mise à jour de votre candidature',
      `Votre candidature pour le poste "${offre.titre}" est maintenant : ${status}`,
    );
  }
}

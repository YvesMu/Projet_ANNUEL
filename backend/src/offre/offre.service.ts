import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offre } from './offre.entity';
import { CreateOffreDto } from './dto/create-offre.dto';
import { User } from '../user/user.entity';
import { Postulation } from '../postulation/postulation.entity';
import { VideoCall } from '../video-call/video-call.entity';

@Injectable()
export class OffreService {
  constructor(
    @InjectRepository(Offre)
    private offreRepository: Repository<Offre>,
    @InjectRepository(Postulation)
    private postulationRepository: Repository<Postulation>,
    @InjectRepository(VideoCall)
    private videoCallRepository: Repository<VideoCall>,
    private dataSource: DataSource,
  ) {}

  async create(createOffreDto: CreateOffreDto, auteur: User): Promise<Offre> {
    const offre = this.offreRepository.create({ ...createOffreDto, auteur });
    return await this.offreRepository.save(offre);
  }

  async findAll(): Promise<Offre[]> {
    return this.offreRepository.find({ relations: ['auteur'] });
  }

  async findByUser(userId: number): Promise<Offre[]> {
    return this.offreRepository.find({
      where: { auteur: { id: userId } },
      relations: ['auteur', 'postulations'],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Vérifier que l'offre existe et appartient à l'utilisateur
      const offre = await queryRunner.manager.findOne(Offre, {
        where: { id, auteur: { id: userId } },
        relations: ['postulations', 'auteur'],
      });

      if (!offre) {
        throw new NotFoundException('Offre introuvable ou non autorisée');
      }

      // Supprimer d'abord tous les appels vidéo liés à cette offre
      await queryRunner.manager.delete(VideoCall, { offre: { id } });

      // Supprimer toutes les postulations liées à cette offre
      await queryRunner.manager.delete(Postulation, { offre: { id } });

      // Puis supprimer l'offre
      await queryRunner.manager.delete(Offre, { id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error("Erreur lors de la suppression de l'offre:", error);
      throw new ForbiddenException("Erreur interne lors de la suppression de l'offre");
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, userId: number, updateDto: CreateOffreDto): Promise<Offre> {
    const offre = await this.offreRepository.findOne({
      where: { id, auteur: { id: userId } },
      relations: ['auteur'],
    });

    if (!offre) {
      throw new Error('Offre introuvable ou non autorisée');
    }

    Object.assign(offre, updateDto);
    return this.offreRepository.save(offre);
  }

  async findById(id: number): Promise<Offre | null> {
    return this.offreRepository.findOne({
      where: { id },
      relations: ['auteur', 'postulations', 'postulations.candidat'],
    });
  }

  async getAllCandidats() {
    return this.offreRepository.find({
      relations: ['postulations', 'postulations.candidat', 'auteur'],
    });
  }

  // Nouvelle méthode : récupérer les offres filtrées par domaine d'utilisateur
  async findByUserDomain(userDomain: string): Promise<Offre[]> {
    return this.offreRepository.find({
      where: { domaine: userDomain },
      relations: ['auteur'],
      order: { createdAt: 'DESC' },
    });
  }

  // Récupérer toutes les offres pour un utilisateur particulier avec priorité sur son domaine
  async findRecommendedOffers(userDomain: string): Promise<{
    recommendedOffers: Offre[];
    otherOffers: Offre[];
  }> {
    // Offres du domaine de l'utilisateur
    const recommendedOffers = await this.offreRepository.find({
      where: { domaine: userDomain },
      relations: ['auteur'],
      order: { createdAt: 'DESC' },
    });

    // Autres offres (domaines différents)
    const otherOffers = await this.offreRepository
      .createQueryBuilder('offre')
      .leftJoinAndSelect('offre.auteur', 'auteur')
      .where('offre.domaine != :userDomain', { userDomain })
      .orderBy('offre.createdAt', 'DESC')
      .getMany();

    return {
      recommendedOffers,
      otherOffers,
    };
  }
}

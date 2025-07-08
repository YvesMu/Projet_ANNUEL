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

  async findByUser(userId: number): Promise<Offre[]> {
    return this.offreRepository.find({
      where: { auteur: { id: userId } },
      relations: ['auteur', 'postulations'],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    const offre = await this.offreRepository.findOne({
      where: { id, auteur: { id: userId } },
      relations: ['auteur', 'postulations'],
    });

    if (!offre) {
      throw new Error('Offre introuvable ou non autorisée');
    }

    // Supprimer l'offre (les postulations seront supprimées en cascade)
    await this.offreRepository.remove(offre);
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

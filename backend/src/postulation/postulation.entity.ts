import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';

export enum PostulationStatus {
  EN_ATTENTE = 'en_attente',
  ENTRETIEN = 'entretien',
  RETENUE = 'retenu',
  REFUSÉE = 'refusé',
}

@Entity()
export class Postulation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.postulations, { eager: true })
  candidat: User;

  @ManyToOne(() => Offre, (offre) => offre.postulations, { eager: true })
  offre: Offre;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: PostulationStatus,
    default: PostulationStatus.EN_ATTENTE,
  })
  status: PostulationStatus;
}

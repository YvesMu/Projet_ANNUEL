import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Postulation } from '../postulation/postulation.entity';

@Entity()
export class Offre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  description: string;

  @Column()
  domaine: string;

  @Column()
  typeContrat: string;

  @Column()
  lieu: string;

  @Column()
  salaire: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  niveauEtude: string;

  @Column({ nullable: true })
  horaires: string;

  @Column('simple-array', { nullable: true })
  avantages: string[];

  @Column('simple-array', { nullable: true })
  competences: string[];

  @Column({ nullable: true })
  dateDebut: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.offres, { eager: true })
  auteur: User;

  @OneToMany(() => Postulation, (postulation) => postulation.offre)
  postulations: Postulation[];
}

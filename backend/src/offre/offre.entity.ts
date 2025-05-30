import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

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

  // ✅ Une seule relation vers User
  @ManyToOne(() => User, (user) => user.offres, { eager: true })
  auteur: User;
}

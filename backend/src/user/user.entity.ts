import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Offre } from '../offre/offre.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: 'particulier' | 'professionnel';

  @Column()
  typeOffre: string;

  @Column()
  domaine: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Offre, (offre) => offre.auteur)
  offres: Offre[];
}

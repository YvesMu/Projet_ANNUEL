import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.id)
  auteur: User;

  @CreateDateColumn()
  createdAt: Date;
}

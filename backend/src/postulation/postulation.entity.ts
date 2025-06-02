import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';

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
}

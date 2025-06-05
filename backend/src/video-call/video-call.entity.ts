import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';

@Entity()
export class VideoCall {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Offre)
  offre: Offre;

  @ManyToOne(() => User)
  candidat: User;

  @ManyToOne(() => User)
  professionnel: User;

  @Column()
  roomUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

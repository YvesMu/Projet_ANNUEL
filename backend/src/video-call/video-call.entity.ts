import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Offre } from '../offre/offre.entity';

@Entity()
export class VideoCall {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Offre, { eager: true })
  offre: Offre;

  @ManyToOne(() => User, { eager: true })
  candidat: User;

  @ManyToOne(() => User, { eager: true })
  professionnel: User;

  @Column()
  roomUrl: string;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ default: false })
  isNotified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

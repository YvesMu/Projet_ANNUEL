import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Offre } from '../offre/offre.entity';
import { Postulation } from '../postulation/postulation.entity';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';

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

  @OneToMany(() => Postulation, (postulation) => postulation.candidat)
  postulations: Postulation[];

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  presentation: string;

  @OneToMany(() => Conversation, (conv) => conv.sender)
  conversationsAsSender: Conversation[];

  @OneToMany(() => Conversation, (conv) => conv.recipient)
  conversationsAsRecipient: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}

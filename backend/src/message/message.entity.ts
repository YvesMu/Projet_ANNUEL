import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Conversation, (conv) => conv.messages)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;
}

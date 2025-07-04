import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.conversationsAsSender)
  sender: User;

  @ManyToOne(() => User, (user) => user.conversationsAsRecipient)
  recipient: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}

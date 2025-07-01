import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, User])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}

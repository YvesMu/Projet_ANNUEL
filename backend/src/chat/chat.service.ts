import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getConversations(userId: number) {
    const conversations = await this.conversationRepo.find({
      where: [{ sender: { id: userId } }, { recipient: { id: userId } }],
      relations: ['sender', 'recipient'],
      order: { id: 'DESC' },
    });

    // Mapper les données pour correspondre au format attendu par le frontend
    return conversations.map((conv) => ({
      id: conv.id,
      senderId: conv.sender.id,
      recipientId: conv.recipient.id,
      sender: conv.sender,
      recipient: conv.recipient,
    }));
  }

  async getMessages(conversationId: number, userId: number) {
    const conv = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['sender', 'recipient'],
    });
    if (!conv) throw new NotFoundException('Conversation introuvable');
    if (conv.sender.id !== userId && conv.recipient.id !== userId) {
      throw new ForbiddenException('Accès interdit à cette conversation');
    }

    const messages = await this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });

    // Mapper les données pour correspondre au format attendu par le frontend
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      senderId: message.sender.id,
      conversationId: conversationId,
      sender: message.sender,
    }));
  }

  async sendMessage(conversationId: number, userId: number, content: string) {
    const conv = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['sender', 'recipient'],
    });
    if (!conv) throw new NotFoundException('Conversation introuvable');
    if (conv.sender.id !== userId && conv.recipient.id !== userId) {
      throw new ForbiddenException('Vous ne participez pas à cette conversation');
    }

    const sender = await this.userRepo.findOneBy({ id: userId });
    if (!sender) throw new NotFoundException('Utilisateur introuvable');
    const message = this.messageRepo.create({ content, conversation: conv, sender });
    return this.messageRepo.save(message);
  }

  async startConversation(senderId: number, recipientId: number) {
    if (senderId === recipientId) {
      throw new ForbiddenException('Impossible de démarrer une conversation avec soi-même');
    }

    const existing = await this.conversationRepo.findOne({
      where: [
        { sender: { id: senderId }, recipient: { id: recipientId } },
        { sender: { id: recipientId }, recipient: { id: senderId } },
      ],
    });

    if (existing) return existing;

    const sender = await this.userRepo.findOneBy({ id: senderId });
    const recipient = await this.userRepo.findOneBy({ id: recipientId });

    if (!sender || !recipient) {
      throw new NotFoundException("Un des utilisateurs n'existe pas");
    }

    const conv = this.conversationRepo.create({
      sender: { id: senderId },
      recipient: { id: recipientId },
    });
    return this.conversationRepo.save(conv);
  }
}

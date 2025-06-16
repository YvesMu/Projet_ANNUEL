import { Controller, UseGuards, Get, Post, Param, Body, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  getUserConversations(@Req() req: Request & { user?: CustomJwtPayload }) {
    return this.chatService.getConversations(req.user!.id);
  }

  @Get('messages/:id')
  getMessages(
    @Param('id') conversationId: number,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    return this.chatService.getMessages(conversationId, req.user!.id);
  }

  @Post('send/:id')
  sendMessage(
    @Param('id') conversationId: number,
    @Body('content') content: string,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    return this.chatService.sendMessage(conversationId, req.user!.id, content);
  }

  @Post('start')
  startConv(
    @Body('recipientId') recipientId: number,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    return this.chatService.startConversation(req.user!.id, recipientId);
  }
}

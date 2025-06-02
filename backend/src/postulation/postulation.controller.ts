import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { PostulationService } from './postulation.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { User } from '../user/user.entity';

@Controller('postulations')
export class PostulationController {
  constructor(private readonly postulationService: PostulationService) {}

  @Post()
  async create(
    @Body() dto: CreatePostulationDto,
    @Req() req: Request & { user?: CustomJwtPayload }
  ) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    const candidat = new User();
    candidat.id = userPayload.id;
    return this.postulationService.create(dto, candidat);
  }

  @Get('my')
  async findMyPostulations(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    return this.postulationService.findByUser(userPayload.id);
  }
}

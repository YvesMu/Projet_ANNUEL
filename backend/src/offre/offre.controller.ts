import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { OffreService } from './offre.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { User } from '../user/user.entity';

@Controller('offres')
export class OffreController {
  constructor(private readonly offreService: OffreService) {}

  @Post()
  async create(
    @Body() createOffreDto: CreateOffreDto,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userPayload = req.user;
    if (!userPayload) {
      throw new Error('Utilisateur non authentifié');
    }

    const auteur = new User();
    auteur.id = userPayload.id;

    return this.offreService.create(createOffreDto, auteur);
  }

  @Get()
  async findAll() {
    return this.offreService.findAll();
  }
}

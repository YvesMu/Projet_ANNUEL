import { Controller, Post, Body, Get, Req, Param, Delete, Put } from '@nestjs/common';
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
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    const auteur = new User();
    auteur.id = userPayload.id;
    return this.offreService.create(createOffreDto, auteur);
  }

  @Get()
  async findAll() {
    return await this.offreService.findAll();
  }

  @Get('/my')
  async findMyOffers(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    return this.offreService.findByUser(userPayload.id);
  }

  @Delete(':id')
  async deleteOffre(
    @Param('id') id: number,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    await this.offreService.delete(id, userPayload.id);
    return { message: 'Offre supprimée avec succès' };
  }

  @Put(':id')
  async updateOffre(
    @Param('id') id: number,
    @Body() updateDto: CreateOffreDto,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');

    return await this.offreService.update(id, userPayload.id, updateDto); 
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offreService.findById(parseInt(id));
  }
}
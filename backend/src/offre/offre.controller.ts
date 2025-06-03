import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OffreService } from './offre.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('offres')
export class OffreController {
  constructor(private readonly offreService: OffreService) {}

  // ✅ PUBLIC : récupération de toutes les offres (public)
  @Get()
  async findAll() {
    return await this.offreService.findAll();
  }

  // ✅ PUBLIC : détail d'une offre
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.offreService.findById(id);
  }

  // ✅ PROTECTED : création réservée aux professionnels
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
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

  // ✅ PROTECTED : récupérer MES offres en tant que professionnel
  @Get('/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async findMyOffers(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    return this.offreService.findByUser(userPayload.id);
  }

  // ✅ PROTECTED : supprimer une offre
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async deleteOffre(@Param('id') id: number, @Req() req: Request & { user?: CustomJwtPayload }) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    await this.offreService.delete(id, userPayload.id);
    return { message: 'Offre supprimée avec succès' };
  }

  // ✅ PROTECTED : modifier une offre
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async updateOffre(
    @Param('id') id: number,
    @Body() updateDto: CreateOffreDto,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userPayload = req.user;
    if (!userPayload) throw new Error('Utilisateur non authentifié');
    return await this.offreService.update(id, userPayload.id, updateDto);
  }
}

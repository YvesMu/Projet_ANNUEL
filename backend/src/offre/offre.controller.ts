import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OffreService } from './offre.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { User } from '../user/user.entity';

@Controller('offres')
export class OffreController {
  constructor(private readonly offreService: OffreService) {}

  // ✅ PUBLIC : récupérer toutes les offres
  @Get()
  async findAll() {
    return await this.offreService.findAll();
  }

  // ✅ PRO : créer une offre (professionnel uniquement)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async create(@Body() createOffreDto: CreateOffreDto, @CurrentUser() user: CustomJwtPayload) {
    const auteur = new User();
    auteur.id = user.id;
    return this.offreService.create(createOffreDto, auteur);
  }

  // ✅ PRO : récupérer MES offres
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async findMyOffers(@CurrentUser() user: CustomJwtPayload) {
    console.log('Payload reçu dans le controller:', user);
    return this.offreService.findByUser(user.id);
  }

  // ✅ PUBLIC : récupérer une offre par son id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.offreService.findById(id);
  }

  // ✅ PRO : supprimer une offre
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async deleteOffre(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CustomJwtPayload) {
    await this.offreService.delete(id, user.id);
    return { message: 'Offre supprimée avec succès' };
  }

  // ✅ PRO : modifier une offre
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async updateOffre(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: CreateOffreDto,
    @CurrentUser() user: CustomJwtPayload,
  ) {
    return await this.offreService.update(id, user.id, updateDto);
  }

  @Get('candidats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('professionnel')
  async finAllCandidats() {
    return this.offreService.getAllCandidats();
  }

  // ✅ PARTICULIER : récupérer les offres recommandées selon le domaine
  @Get('recommended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('particulier')
  async getRecommendedOffers(@CurrentUser() user: CustomJwtPayload) {
    // On doit récupérer les infos complètes de l'utilisateur pour avoir son domaine
    if (!user.domaine) {
      throw new Error('Domaine utilisateur non défini');
    }
    return this.offreService.findRecommendedOffers(user.domaine);
  }

  // ✅ PARTICULIER : récupérer uniquement les offres de mon domaine
  @Get('my-domain')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('particulier')
  async getOffersByMyDomain(@CurrentUser() user: CustomJwtPayload) {
    if (!user.domaine) {
      throw new Error('Domaine utilisateur non défini');
    }
    return this.offreService.findByUserDomain(user.domaine);
  }
}

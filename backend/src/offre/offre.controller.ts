import { Controller, Post, Body, Get } from '@nestjs/common';
import { OffreService } from './offre.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { User } from '../user/user.entity';

@Controller('offres')
export class OffreController {
  constructor(private readonly offreService: OffreService) {}

  @Post()
  async create(@Body() createOffreDto: CreateOffreDto) {
    // ➔ Ici on met un faux auteur en attendant l'authentification
    const auteurFictif: User = { id: 1 } as User;
    return this.offreService.create(createOffreDto, auteurFictif);
  }

  @Get()
  async findAll() {
    return this.offreService.findAll();
  }
}

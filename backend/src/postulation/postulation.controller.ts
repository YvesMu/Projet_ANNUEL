import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PostulationService } from './postulation.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PostulationStatus } from './postulation.entity';

@Controller('postulations')
@UseGuards(JwtAuthGuard)
export class PostulationController {
  constructor(private readonly postulationService: PostulationService) {}

  @Post()
  async create(
    @Body() dto: CreatePostulationDto,
    @Req() req: Request & { user?: CustomJwtPayload },
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

  // ✅ NOUVELLE ROUTE ICI :
  @Get()
  @UseGuards(RolesGuard)
  @Roles('professionnel')
  async getAllPostulations() {
    return this.postulationService.findAllWithRelations();
  }

  @Put(':id/statut')
  @UseGuards(RolesGuard)
  @Roles('professionnel')
  async updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body('statut') statut: PostulationStatus,
  ) {
    return this.postulationService.updateStatut(id, statut);
  }
}

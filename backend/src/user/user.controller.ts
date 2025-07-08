import {
  Controller,
  Put,
  Get,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Body()
    update: {
      cvUrl?: string;
      presentation?: string;
      photoUrl?: string;
      domaine?: string;
      typeOffre?: string;
    },
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userId = req.user?.id;
    if (!userId) throw new Error('User ID is missing or invalid');
    
    const updatedUser = await this.userService.updateProfile(userId, update);
    
    // Si le domaine ou d'autres données importantes ont été mises à jour, 
    // générer un nouveau token JWT
    if (update.domaine || update.typeOffre) {
      const newTokenData = await this.authService.generateNewToken(userId);
      return {
        user: updatedUser,
        newToken: newTokenData.token
      };
    }
    
    return { user: updatedUser };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userId = req.user?.id;
    if (!userId) throw new Error('User ID is missing or invalid');
    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('upload/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './uploads/profile';
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `photo_${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');

    const backendUrl = this.config.get<string>('BACKEND_URL');
    const photoUrl = `${backendUrl}/uploads/profile/${file.filename}`;

    const userId = req.user?.id;
    if (typeof userId !== 'number') throw new Error('User ID is missing or invalid');
    return this.userService.updateProfile(userId, { photoUrl });
  }

  @UseGuards(JwtAuthGuard)
  @Put('upload/cv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './uploads/cv';
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `cv_${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadCV(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');

    const backendUrl = this.config.get<string>('BACKEND_URL');
    const cvUrl = `${backendUrl}/uploads/cv/${file.filename}`;

    const userId = req.user?.id;
    if (typeof userId !== 'number') throw new Error('User ID is missing or invalid');
    return this.userService.updateProfile(userId, { cvUrl });
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidats')
  async getCandidats() {
    return this.userService.getAllCandidats();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }
}

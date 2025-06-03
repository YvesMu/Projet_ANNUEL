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
import { Request } from 'express';
import { CustomJwtPayload } from '../common/interfaces/custom-jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Partie déjà existante ✅
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Body() update: { cvUrl?: string; presentation?: string; photoUrl?: string },
    @Req() req: Request & { user?: CustomJwtPayload },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.updateProfile(userId, update);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user?: CustomJwtPayload }) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.findById(userId);
  }

  // ✅ Nouvelle route d'upload pour la photo
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
    const photoUrl = `http://localhost:5000/uploads/profile/${file.filename}`;
    const userId = req.user?.id;
    if (typeof userId !== 'number') {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.updateProfile(userId, { photoUrl });
  }

  // ✅ Nouvelle route d'upload pour le CV
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
    const cvUrl = `http://localhost:5000/uploads/cv/${file.filename}`;
    const userId = req.user?.id;
    if (typeof userId !== 'number') {
      throw new Error('User ID is missing or invalid');
    }
    return this.userService.updateProfile(userId, { cvUrl });
  }
}

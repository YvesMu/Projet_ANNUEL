import { Module } from '@nestjs/common';
import { PostulationService } from './postulation.service';
import { PostulationController } from './postulation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postulation } from './postulation.entity';
import { Offre } from '../offre/offre.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Postulation, Offre]),
    MailerModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [PostulationService],
  controllers: [PostulationController],
})
export class PostulationModule {}

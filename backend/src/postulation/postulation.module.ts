import { Module } from '@nestjs/common';
import { PostulationService } from './postulation.service';
import { PostulationController } from './postulation.controller';

@Module({
  providers: [PostulationService],
  controllers: [PostulationController]
})
export class PostulationModule {}

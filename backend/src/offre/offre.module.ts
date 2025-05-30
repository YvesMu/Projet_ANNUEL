import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OffreController } from './offre.controller';
import { OffreService } from './offre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre } from './offre.entity';
import { IsProfessionalMiddleware } from '../common/middleware/is-professional.middleware';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offre, User])],
  controllers: [OffreController],
  providers: [OffreService],
})
export class OffreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsProfessionalMiddleware).forRoutes(OffreController);
  }
}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre } from './offre.entity';
import { User } from '../user/user.entity';
import { Postulation } from '../postulation/postulation.entity';
import { VideoCall } from '../video-call/video-call.entity';
import { OffreController } from './offre.controller';
import { OffreService } from './offre.service';
import { IsProfessionalMiddleware } from '../common/middleware/is-professional.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offre, User, Postulation, VideoCall]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [OffreController],
  providers: [OffreService, ConfigService],
})
export class OffreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsProfessionalMiddleware)
      .forRoutes({ path: 'offres', method: RequestMethod.POST });
  }
}

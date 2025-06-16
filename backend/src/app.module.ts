import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { typeOrmConfig } from './typeorm.config';
import { OffreModule } from './offre/offre.module';
import { PostulationModule } from './postulation/postulation.module';
import { VideoCallModule } from './video-call/video-call.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    MailerModule,
    OffreModule,
    PostulationModule,
    VideoCallModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

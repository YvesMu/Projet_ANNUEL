import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  console.log('LoadedJWT_SECRET :', config.get<string>('JWT_SECRET'));

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:31000'],
    credentials: true,
  });

  // 💡 Ici on expose ton dossier "uploads"
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});

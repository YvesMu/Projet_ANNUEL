import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { Offre } from './offre/offre.entity';
import { Postulation } from './postulation/postulation.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT', '5432'), 10),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [User, Offre, Postulation],
  synchronize: true,
});

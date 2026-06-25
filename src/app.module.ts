import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import Keyv from 'keyv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envs } from './config/envs';
import { PostgisBootstrapService } from './database/postgis-bootstrap.service';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { LostPetsModule } from './lost-pets/lost-pets.module';

function buildRedisUrl(): string {
  if (envs.REDIS_URL) {
    return envs.REDIS_URL;
  }

  const pwd = envs.REDIS_PASSWORD;
  if (pwd) {
    return `redis://:${encodeURIComponent(pwd)}@${envs.REDIS_HOST}:${envs.REDIS_PORT}`;
  }
  return `redis://${envs.REDIS_HOST}:${envs.REDIS_PORT}`;
}

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [
          new Keyv({
            store: new KeyvRedis(buildRedisUrl()),
          }),
        ],
        ttl: 60_000,
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      ssl: envs.DB_SSL ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    LostPetsModule,
    FoundPetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostgisBootstrapService],
})
export class AppModule {}

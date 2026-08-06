import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FeatureUserModule } from './feature-user/feature-user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { FeatureUserController } from './feature-user/feature-user.controller';
import { FeatureUserService } from './feature-user/feature-user.service';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './feature-articles/articles.module';
import { GamesModule } from './feature-games/games.module';
import { PlayersModule } from './feature-players/players.module';
import { PartnersModule } from './feature-partners/partners.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    FeatureUserModule,
    AuthModule,
    ArticlesModule,
    GamesModule,
    PlayersModule,
    PartnersModule,
  ],
  controllers: [AppController, FeatureUserController],
  providers: [AppService, FeatureUserService],
})
export class AppModule {}

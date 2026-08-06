import { Module } from '@nestjs/common';
import { FeatureUserService } from './feature-user.service';
import { FeatureUserController } from './feature-user.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FeatureUserController],
  providers: [FeatureUserService],
  exports: [FeatureUserService],
})
export class FeatureUserModule {}

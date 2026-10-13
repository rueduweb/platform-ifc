import { Module } from '@nestjs/common';
import { FeatureTeamsService } from './feature-teams.service';
import { FeatureTeamsController } from './feature-teams.controller';

@Module({
  controllers: [FeatureTeamsController],
  providers: [FeatureTeamsService],
})
export class FeatureTeamsModule {}

import { Module } from '@nestjs/common';
import { FeatureTeamService } from './feature-team.service';
import { FeatureTeamController } from './feature-team.controller';

@Module({
  controllers: [FeatureTeamController],
  providers: [FeatureTeamService],
})
export class FeatureTeamModule {}

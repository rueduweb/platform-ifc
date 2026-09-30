import { Test, TestingModule } from '@nestjs/testing';
import { FeatureTeamController } from './feature-team.controller';
import { FeatureTeamService } from './feature-team.service';

describe('FeatureTeamController', () => {
  let controller: FeatureTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureTeamController],
      providers: [FeatureTeamService],
    }).compile();

    controller = module.get<FeatureTeamController>(FeatureTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FeatureTeamsController } from './feature-teams.controller';
import { FeatureTeamsService } from './feature-teams.service';

describe('FeatureTeamsController', () => {
  let controller: FeatureTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureTeamsController],
      providers: [FeatureTeamsService],
    }).compile();

    controller = module.get<FeatureTeamsController>(FeatureTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

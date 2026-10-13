import { Test, TestingModule } from '@nestjs/testing';
import { FeatureTeamsService } from './feature-teams.service';

describe('FeatureTeamsService', () => {
  let service: FeatureTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureTeamsService],
    }).compile();

    service = module.get<FeatureTeamsService>(FeatureTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

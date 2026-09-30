import { Test, TestingModule } from '@nestjs/testing';
import { FeatureTeamService } from './feature-team.service';

describe('FeatureTeamService', () => {
  let service: FeatureTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureTeamService],
    }).compile();

    service = module.get<FeatureTeamService>(FeatureTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

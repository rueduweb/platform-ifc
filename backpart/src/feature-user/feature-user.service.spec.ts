import { Test, TestingModule } from '@nestjs/testing';
import { FeatureUserService } from './feature-user.service';

describe('FeatureUserService', () => {
  let service: FeatureUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureUserService],
    }).compile();

    service = module.get<FeatureUserService>(FeatureUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

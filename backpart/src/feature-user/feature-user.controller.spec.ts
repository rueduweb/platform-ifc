import { Test, TestingModule } from '@nestjs/testing';
import { FeatureUserController } from './feature-user.controller';
import { FeatureUserService } from './feature-user.service';

describe('FeatureUserController', () => {
  let controller: FeatureUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureUserController],
      providers: [FeatureUserService],
    }).compile();

    controller = module.get<FeatureUserController>(FeatureUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

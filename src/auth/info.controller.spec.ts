import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InfoController } from './info.controller';

describe('InfoController', () => {
  let authService: AuthService;
  let infoController: InfoController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [InfoController],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    infoController = moduleRef.get<InfoController>(InfoController);
  });

  it('should be defined', () => {
    expect(infoController).toBeDefined();
  });
});

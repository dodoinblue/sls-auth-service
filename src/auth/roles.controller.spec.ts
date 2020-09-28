import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { RolesController } from './roles.controller';

describe('RolesController', () => {
  let authService: AuthService;
  let controller: RolesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [RolesController],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    controller = moduleRef.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

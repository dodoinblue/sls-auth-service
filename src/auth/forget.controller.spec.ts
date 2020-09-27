import { Test, TestingModule } from '@nestjs/testing';
import { OkResponse } from '../common/ok.responses';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { ForgetController } from './forget.controller';

describe('ForgetController', () => {
  let forgetController: ForgetController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ForgetController],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    forgetController = moduleRef.get<ForgetController>(ForgetController);
  });

  describe('code', () => {
    it('should call requestPasswordResetEmail with correct info', async () => {
      const myMock = jest.fn(async () => new OkResponse());
      jest
        .spyOn(authService, 'requestPasswordResetEmail')
        .mockImplementation(myMock);

      expect(
        await forgetController.sendCode({ email: 'email@test.com' }),
      ).toEqual(new OkResponse());

      expect(myMock).toHaveBeenCalledTimes(1);
    });
  });
});

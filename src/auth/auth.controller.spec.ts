import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// jest.mock('./auth.service');

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return an array of cats', async () => {
      const result = {
        accessToken: 'token',
        refreshToken: 'rToken',
        id: 'id',
        username: 'name',
      };
      const myMock = jest.fn(async () => result);
      jest
        .spyOn(authService, 'loginWithUsernamePassword')
        .mockImplementation(myMock);

      expect(
        await authController.login({ username: 'name', password: 'pwd' }),
      ).toBe(result);

      // expect(myMock.mock.calls[0]).toEqual(['name', 'pwd']);
      expect(myMock).toHaveBeenCalledWith('name', 'pwd')
    });
  });
});

import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('Cats', () => {
  let app: INestApplication;
  const authService = {
    loginWithUsernamePassword: async () => ({ accessToken: 'atoken' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST login`, () => {
    return request(app.getHttpServer())
      .post('/login')
      .set('Accept', 'application/json')
      .send({ username: 'abc' })
      .expect(201)
      .expect({ accessToken: 'atoken' });
  });

  afterAll(async () => {
    await app.close();
  });
});

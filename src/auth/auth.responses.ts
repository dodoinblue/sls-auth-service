import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponse {
  @ApiProperty({
    example: 'Oa0kX9Xy5m60KtNlbxxIS',
    description: 'Id of the account',
  })
  id: string;

  @ApiProperty({
    example: 'user123',
    description: 'Username associated wit the account',
  })
  username: string;

  @ApiProperty({
    example: 'email@sample.com',
  })
  readonly email?: string;

  @ApiProperty({
    example: '+8613911111111',
  })
  readonly phone?: string;
}

export class LoginResponse extends RegistrationResponse {
  @ApiProperty({
    example: 'Access token',
    description: 'Access token to be used to access protected resources',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'U2FsdGVkX1/7ee2U6hNli3zDXkq7qT/yOAiQZvJ1aEtgr0yCgjzUQ571izH7EhKQPOIcyIz9OtFH2pHrvmWCI5cu5SCwKhZn+KEzRlKaV5w=',
    description: 'Refresh token to renew access token',
  })
  refreshToken: string;
}

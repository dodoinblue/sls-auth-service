import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse, RegistrationResponse } from './auth.responses';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from './dtos/refresh.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description:
      'Login response with accessToken and other basic account info.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.loginWithUsernamePassword(
      loginDto.username,
      loginDto.password,
    );
  }

  @Post('/register')
  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({
    status: 200,
    description: 'Create an account',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegistrationResponse> {
    return await this.authService.createAccount(
      registerDto.username,
      registerDto.password,
    );
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({
    status: 200,
    description: 'Create an account',
  })
  async refresh(@Body() refreshDto: RefreshDto): Promise<RegistrationResponse> {
    return await this.authService.loginByRefreshToken(
      refreshDto.refreshToken,
      refreshDto.accountId,
    );
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout current session.' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async logout() {
    return { message: 'OK' };
  }

  // @Get(':id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'The found record',
  //   type: Cat,
  // })
  // findOne(@Param('id') id: string): Cat {
  //   return this.catsService.findOne(+id);
  // }
}

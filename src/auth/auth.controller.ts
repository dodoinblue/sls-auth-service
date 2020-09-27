import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse, RegistrationResponse } from './auth.responses';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from './dtos/refresh.dto';
import { AuthGuard } from '../guards/auth.guard';

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
    return await this.authService.createAccount(registerDto);
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

  @Post('/logout/sessions/:sessionId')
  @ApiOperation({ summary: 'Logout current session.' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @UseGuards(AuthGuard)
  async logout(@Param('sessionId') sessionId: string, @Req() req: any) {
    console.log('logout');
    return this.authService.logoutSession(sessionId, req.custom.accountId);
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

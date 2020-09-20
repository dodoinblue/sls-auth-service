import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from './auth.responses';
import { RegisterDto } from './dtos/register.dto';
import { AuthModel } from './auth.model';

@Controller()
@ApiTags('Auth')
export class AuthController {
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description:
      'Login response with accessToken and other basic account info.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const account = await AuthModel.query().findOne({
      username: loginDto.username,
    })

    return {
      ...account,
      accessToken: 'tokenA',
      refreshToken: 'tokenR',
    };
  }

  @Post('/register')
  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({
    status: 200,
    description: 'Create an account',
  })
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponse> {
    const account = await AuthModel.query().insert(registerDto);

    return {
      ...account.toJSON(),
      accessToken: 'tokenA',
      refreshToken: 'tokenR',
    };
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

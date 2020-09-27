import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OkResponse } from '../common/ok.responses';
import { AuthService } from './auth.service';
import { ForgetCodeDto } from './dtos/forget-code.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('forget')
export class ForgetController {
  constructor(private readonly authService: AuthService) {}

  @Post('/code')
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({
    status: 200,
    description:
      'An email or a sms with verification code has been sent to user.',
  })
  async sendCode(
    @Body() forgetCodeRequest: ForgetCodeDto,
  ): Promise<OkResponse> {
    if (forgetCodeRequest.email) {
      return this.authService.requestPasswordResetEmail(
        forgetCodeRequest.email,
      );
    } else if (forgetCodeRequest.phone) {
      throw new InternalServerErrorException('Not implemented yet');
    } else {
      throw new BadRequestException(
        'Bad request',
        'Email or phone number must be provided',
      );
    }
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({
    status: 200,
    description:
      'An email or a sms with verification code has been sent to user.',
  })
  async resetPasswordWithCode(
    @Body() resetRequest: ResetPasswordDto,
  ): Promise<OkResponse> {
    if (resetRequest.email) {
      return this.authService.resetPasswordWithCode(resetRequest);
    } else if (resetRequest.phone) {
      throw new InternalServerErrorException('Not implemented yet');
    } else {
      throw new BadRequestException(
        'Bad request',
        'Email or phone number must be provided',
      );
    }
  }
}

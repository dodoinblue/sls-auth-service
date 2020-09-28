import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AccountId } from './account-id.decorator';
import { AccountInfoResponse } from './auth.responses';
import { AuthService } from './auth.service';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller()
@ApiTags('Account Info')
export class InfoController {
  constructor(private readonly authService: AuthService) {}

  @Get('accounts/my')
  @ApiOperation({ summary: 'Get account info' })
  @ApiResponse({
    status: 200,
    description: 'Account info such as address, name, etc.',
  })
  @UseGuards(AuthGuard)
  async getAccountInfo(
    @AccountId() accountId: string,
  ): Promise<Partial<AccountInfoResponse>> {
    return await this.authService.getAccountInfo(accountId);
  }

  @Post('accounts/my')
  @ApiOperation({ summary: 'Update account info' })
  @ApiResponse({
    status: 200,
    description: 'Update account info, such as address, name, etc.',
  })
  @UseGuards(AuthGuard)
  async updateAccountInfo(
    @AccountId() accountId: string,
    @Body() updateRequest: UpdateAccountDto
  ): Promise<Partial<AccountInfoResponse>> {
    return await this.authService.updateAccountInfo(accountId, updateRequest);
  }
}

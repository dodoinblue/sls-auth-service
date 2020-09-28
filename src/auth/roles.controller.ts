import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../guards/auth.guard';
import { AccountInfoResponse } from './auth.responses';
import { AuthService } from './auth.service';
import { UpdateRolesDto } from './dtos/update-roles.dto';

@Controller('')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly authService: AuthService) {}

  @Get('accounts/:accountId/roles')
  @ApiOperation({ summary: 'Get roles' })
  @ApiResponse({
    status: 200,
    description: 'Get roles of an account',
  })
  @UseGuards(AuthGuard, new RolesGuard(['admin']))
  async getRoles(
    @Param('accountId') accountId: string,
  ): Promise<Partial<AccountInfoResponse>> {
    return await this.authService.getRoles(accountId);
  }

  @Post('accounts/:accountId/roles')
  @ApiOperation({ summary: 'Add roles' })
  @ApiResponse({
    status: 200,
    description: 'Updated roles array',
  })
  @UseGuards(AuthGuard, new RolesGuard(['admin']))
  async addRole(
    @Param('accountId') accountId: string,
    @Body() rolesRequest: UpdateRolesDto,
  ): Promise<string[]> {
    return await this.authService.addRoles(
      accountId,
      rolesRequest.roles,
      false,
    );
  }

  @Delete('accounts/:accountId/roles')
  @ApiOperation({ summary: 'Remove roles' })
  @ApiResponse({
    status: 200,
    description: 'Updated roles array',
  })
  @UseGuards(AuthGuard, new RolesGuard(['admin']))
  async removeRole(
    @Param('accountId') accountId: string,
    @Body() rolesRequest: UpdateRolesDto,
  ): Promise<string[]> {
    return await this.authService.removeRoles(accountId, rolesRequest.roles);
  }
}

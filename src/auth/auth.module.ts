import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgetController } from './forget.controller';
import { InfoController } from './info.controller';
import { RolesController } from './roles.controller';

@Module({
  controllers: [AuthController, ForgetController, InfoController, RolesController],
  providers: [AuthService]
})
export class AuthModule {}

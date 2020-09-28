import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgetController } from './forget.controller';
import { InfoController } from './info.controller';

@Module({
  controllers: [AuthController, ForgetController, InfoController],
  providers: [AuthService]
})
export class AuthModule {}

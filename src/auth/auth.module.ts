import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgetController } from './forget.controller';

@Module({
  controllers: [AuthController, ForgetController],
  providers: [AuthService]
})
export class AuthModule {}

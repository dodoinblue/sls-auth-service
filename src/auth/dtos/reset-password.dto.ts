import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @ValidateIf(obj => !obj.phone)
  @ApiProperty({
    example: 'email@sample.com',
    description: 'Email address. Required if phone number is empty',
  })
  readonly email: string;

  @IsPhoneNumber('ZZ')
  @ValidateIf(obj => !obj.email)
  @ApiProperty({
    example: '+8613911111111',
    description:
      'Phone number, must begin with +country code. Required if email is empty',
  })
  readonly phone: string;

  @IsString()
  @Length(6, 60)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;
}

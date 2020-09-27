import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class ForgetCodeDto {
  @IsEmail()
  @IsOptional()
  @ValidateIf(obj => !obj.phone)
  @ApiProperty({
    example: 'email@sample.com',
    description: 'Email address. Required if phone number is empty',
  })
  readonly email?: string;

  @IsPhoneNumber('ZZ')
  @IsOptional()
  @ValidateIf(obj => !obj.email)
  @ApiProperty({
    example: '+8613911111111',
    description: 'Phone number, must begin with +country code. Required if email is empty',
  })
  readonly phone?: string;
}

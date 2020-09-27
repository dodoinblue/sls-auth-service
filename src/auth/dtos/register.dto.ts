import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({
    example: 'user123',
    description: 'Username associated wit the account',
  })
  readonly username: string;

  @IsString()
  readonly password: string;

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
    description: 'Phone number, must begin with +country code. Required if email is empty',
  })
  readonly phone: string;
}

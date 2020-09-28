import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    example: 'n1ckname',
  })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'https://cnd.example.com/link-to-proile.png',
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    example: 'Canada',
  })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({
    example: 'British Columbia',
  })
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty({
    example: 'Vancouver',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    example: '510 Seymour Street',
  })
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'ABA BAB',
  })
  postalCode: string;
}

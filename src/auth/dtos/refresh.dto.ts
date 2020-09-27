import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  @ApiProperty({
    description: 'Refresh token',
    example: 'U2FsdGVkX18y3deX+u207ozatIMs5/2cND7xofUDpWo=',
  })
  refreshToken: string;

  @IsString()
  @ApiProperty({
    description: 'Account ID',
    example: 'SevT6XsaLJ35C9PUMxbCy',
  })
  accountId: string;
}

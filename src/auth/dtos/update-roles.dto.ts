import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRolesDto {
  @ApiProperty({
    example: ['admin', 'member'],
  })
  @IsString({ each: true })
  roles: string[];
}

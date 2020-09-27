import { ApiProperty } from '@nestjs/swagger';

export class OkResponse {
  constructor() {
    this.message = 'OK';
  }

  @ApiProperty({
    example: 'OK',
    description: 'Ok message',
  })
  message: 'OK';
}

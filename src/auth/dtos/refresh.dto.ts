import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class RefreshDto {
  @IsString()
  @JSONSchema({
    description: 'Refresh token',
    example: 'U2FsdGVkX18y3deX+u207ozatIMs5/2cND7xofUDpWo=',
  })
  refreshToken: string;

  @IsString()
  @JSONSchema({
    description: 'Account ID',
    example: 'SevT6XsaLJ35C9PUMxbCy',
  })
  accountId: string;
}

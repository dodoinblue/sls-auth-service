import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccountId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.custom.accountId as string;
  },
);

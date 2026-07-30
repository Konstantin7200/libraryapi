import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (reqHasUserId(req)) {
      return req.userId;
    }
    return null;
  },
);
type reqWithUserId = Request & {
  userId: number;
};

function reqHasUserId(req: Request): req is reqWithUserId {
  if (Object.hasOwn(req, 'userId')) return true;
  return false;
}

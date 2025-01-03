import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';
import { TOKEN_PAYLOAD } from "../auth.constants";

export const TokenPayloadParam = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const context = ctx.switchToHttp();
      const request: Request = context.getRequest();
      return request[TOKEN_PAYLOAD];
    },
  );

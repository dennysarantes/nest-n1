import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UrlParam = createParamDecorator(
    (dadosPassadosDecorator: any, contexto: ExecutionContext) => {
        const ctxReq: Request = contexto.switchToHttp().getRequest();

        return ctxReq.url;
    },
);

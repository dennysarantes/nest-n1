import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Middleware genérico', req.body);
        //throw new Error("Method not implemented.");

        req['user'] = { nome: 'Dennys Arantes' };

        next();
    }
}

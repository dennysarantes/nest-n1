import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { delay, Observable, tap } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const i = new Date().getTime();
        console.log('entrada interceptor...');
        const response = context.switchToHttp().getResponse();

        response.setHeader('teste_cabecalho', '123456789');
        return next.handle().pipe(
            delay(0),
            tap(() => {
                const s = new Date().getTime();
                console.log('saída interceptor...', s - i + ' milissegundos');
            }),
        );
    }
}

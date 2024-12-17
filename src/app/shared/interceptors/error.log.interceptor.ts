import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class ErrorLogInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            tap((response) => {
                console.log('response...', response?.statusCode);
                // Aqui pode ser implementado qualquer código de Log...
            }),
            catchError((error) => {
                // Caso seja necessário modificar o erro, basta tratar aqui.
                // Aqui pode ser implementado qualquer código de Log...
                console.log('error: ', error?.name);
                return throwError(() => error);
            }),
        );
    }
}

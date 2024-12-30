import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {

        const { authorization } = context.switchToHttp().getRequest().headers;
        console.log('Intercept Authorization: ', authorization);

        if (authorization) {
            // Valida o Token aqui...
            return next.handle();
        }

        throw new UnauthorizedException('Token inválido');
    }
}

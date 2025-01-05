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
        const url = context.switchToHttp().getRequest().url
        console.log('Intercept Authorization: ', authorization);

        if (authorization || url === '/auth/login') {
            console.log("context.switchToHttp().getRequest().params: ", context.switchToHttp().getRequest().params);
            // Valida o Token aqui...
            return next.handle();
        }

        throw new UnauthorizedException('Token inválido');
    }
}

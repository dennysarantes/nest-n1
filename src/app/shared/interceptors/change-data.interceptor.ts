import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const customHeader = request.headers['teste'];
        console.log('customHeader: ', customHeader);

        if (customHeader) {
            console.log('entrou...');
            // Retorna diretamente a resposta ao cliente
            response.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'teste retornando resposta.',
                data: null,
            });

            return of(response); // Finaliza a execução do interceptor
        }

        // Caso a verificação passe, prossegue normalmente com a requisição
        return next.handle();
    }
}

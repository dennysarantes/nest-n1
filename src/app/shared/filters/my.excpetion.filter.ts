import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    //UnauthorizedException,
} from '@nestjs/common';

@Catch(/* UnauthorizedException */)
export class MinhaExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log('Aconteceu uma exception', exception);

        const res = host.switchToHttp().getResponse();

        res.status(404).json({ mensagem: 'Erro filtradox.' });
    }
}

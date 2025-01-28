import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
//import { SimpleMiddleware } from './app/shared/middlewares/simple.middleware';
//import { CacheInterceptor } from './app/shared/interceptors/cache.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Esta é uma forma de usar middlewares, mas existe outra que foi aplicada no app module.
    /*  app.use((req, res, next) => {
        new SimpleMiddleware().use(req, res, next);
    }); */

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //remove chaves que não estão no DTO
            forbidNonWhitelisted: true, // retorna erro quando chave DTO não existir
            transform: true, // true tenta transformar os tipos de param e dtos
        }),
    );

    if (process.env.AMBIENTE === 'prd') {
        // HELMET -> cabeçalhos de segurança no protocolo HTTP
        app.use(helmet());

        // cors -> quais domínios vão poder fazer request
        app.enableCors({
            origin: 'https://minhaaplicacao.com.br',
        });
    }

    await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();

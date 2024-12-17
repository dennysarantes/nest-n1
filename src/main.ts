import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
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
            transform: false, // true tenta transformar os tipos de param e dtos
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

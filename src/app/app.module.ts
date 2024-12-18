import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/* import { ConceitoModule } from './conceito/conceito.module';
import { CrudAutModule } from './crud-aut/crud-aut.module'; */
import { RecadosModule } from './recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroments } from 'enviroments/enviroments';
import { PessoasModule } from './pessoas/pessoas.module';
import { RolesModule } from './roles/roles.module';
import { SimpleMiddleware } from './shared/middlewares/simple.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthTokenInterceptor } from './shared/interceptors/auth.token.interceptor';
import { ChangeDataInterceptor } from './shared/interceptors/change-data.interceptor';
import { ErrorLogInterceptor } from './shared/interceptors/error.log.interceptor';
import { MinhaExceptionFilter } from './shared/filters/my.excpetion.filter';
import { IsAdminGuard } from './shared/guards/is-admin.guard';

@Module({
    //imports: [ConceitoModule, CrudAutModule],
    imports: [
        RecadosModule,
        PessoasModule,
        RolesModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: enviroments.variaveis.configBanco.host,
            port: enviroments.variaveis.configBanco.porta,
            username: enviroments.variaveis.configBanco.username,
            database: enviroments.variaveis.configBanco.nomeBd,
            password: enviroments.variaveis.configBanco.password,
            autoLoadEntities: true, // Carrega as entidades sem precisar especificá-las
            synchronize: enviroments.variaveis.contexto != 'prd' ? true : false, // Sincroniza as mudanças com o banco: NÃO PODE FAZER EM PRODUÇÃO
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: MinhaExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AuthTokenInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ChangeDataInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorLogInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: IsAdminGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SimpleMiddleware).forRoutes('recados');
    }
}

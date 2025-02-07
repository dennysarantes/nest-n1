import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/* import { ConceitoModule } from './conceito/conceito.module';
import { CrudAutModule } from './crud-aut/crud-aut.module'; */
import { RecadosModule } from './recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { enviroments } from 'enviroments/enviroments';
import { PessoasModule } from './pessoas/pessoas.module';
import { RolesModule } from './roles/roles.module';
import { SimpleMiddleware } from './shared/middlewares/simple.middleware';
import {
    /* APP_FILTER, APP_GUARD, */ APP_GUARD,
    APP_INTERCEPTOR,
} from '@nestjs/core';
//import { AuthTokenInterceptor } from './shared/interceptors/auth.token.interceptor';
import { ChangeDataInterceptor } from './shared/interceptors/change-data.interceptor';
import { ErrorLogInterceptor } from './shared/interceptors/error.log.interceptor';
//import { MinhaExceptionFilter } from './shared/filters/my.excpetion.filter';
//import { IsAdminGuard } from './shared/guards/is-admin.guard';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import { AuthModule } from './shared/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
//import { AuthTokenGuard } from './shared/guards/AuthTokenGuard';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
    //imports: [ConceitoModule, CrudAutModule],
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // tempo de vida em ms (1000 == 1s)
                limit: 10, // Limite de requisições dentro do ttl
                blockDuration: 5000, // tempo de bloqueio em ms
            },
        ]),

        ConfigModule.forRoot({
            envFilePath: 'enviroments/.env',
            //load: [appConfig]
        }),
        ConfigModule.forFeature(appConfig),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: async (appConfg: ConfigType<typeof appConfig>) => {
                return {
                    type: appConfg.database.type,
                    host: appConfg.database.host,
                    port: appConfg.database.port,
                    username: appConfg.database.username,
                    database: appConfg.database.database,
                    password: appConfg.database.password,
                    autoLoadEntities: appConfg.database.autoLoadEntities,
                    synchronize: appConfg.database.synchronize,
                    cache: false,
                };
            },
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', '..', '..', 'pictures'),
            serveRoot: '/pictures',
        }),
        RecadosModule,
        RolesModule,
        forwardRef(() => PessoasModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        AppService,
        /* {
            provide: APP_FILTER,
            useClass: MinhaExceptionFilter,
        }, */
        /* {
            provide: APP_INTERCEPTOR,
            useClass: AuthTokenInterceptor,
        }, */
        {
            provide: APP_INTERCEPTOR,
            useClass: ChangeDataInterceptor,
        },
        /* {
            provide: APP_GUARD,
            useClass: AuthTokenGuard,
        }, */
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorLogInterceptor,
        },

        /* {
            provide: APP_GUARD,
            useClass: IsAdminGuard,
        }, */
    ],
})
export class AppModule implements NestModule {
    constructor() {
        //console.log(process.env.VARIAVEL1);
        //console.log(process.env.VARIAVEL2);
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SimpleMiddleware).forRoutes('recados');
    }
}

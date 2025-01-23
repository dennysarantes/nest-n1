import { Test, TestingModule } from '@nestjs/testing';
import {
    forwardRef,
    Headers,
    HttpStatus,
    INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
//import { AppModule } from 'src/app/app.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import appConfig from 'src/app/app.config';
import { PessoasModule } from 'src/app/pessoas/pessoas.module';
import { RecadosModule } from 'src/app/recados/recados.module';
import { RolesModule } from 'src/app/roles/roles.module';
import { AuthModule } from 'src/app/shared/auth/auth.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'enviroments/.env',
                    //load: [appConfig]
                }),
                ConfigModule.forFeature(appConfig),

                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'dennys_arantes',
                    database: 'nest-m1-teste',
                    password: process.env.BANCO_LOCALHOST,
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true,
                }),
                ServeStaticModule.forRoot({
                    rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
                    serveRoot: '/pictures',
                }),
                RecadosModule,
                RolesModule,
                forwardRef(() => PessoasModule),
                forwardRef(() => AuthModule),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/pessoas (POST)', () => {
        it('deve criar uma pessoa com sucesso', async () => {
            const token_teste = 'Bearer teste';
            const createPessoaDTO = {
                email: 'novoUsuario@app.com',
                password: '12345678',
                nome: 'Novo usuario teste',
                roles: [],
            };

            const resp = await request(app.getHttpServer())
                .post('/pessoas')
                .send(createPessoaDTO)
                .set('authorization', token_teste)
                .expect(HttpStatus.CREATED);

            expect(resp.body).toEqual(
                expect.objectContaining({
                    email: createPessoaDTO.email,
                    passwordHash: expect.any(String),
                    nome: createPessoaDTO.nome,
                }),
            );
        });
    });

    // it('/ (GET)', () => {
    /* return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!'); */
    // });
});

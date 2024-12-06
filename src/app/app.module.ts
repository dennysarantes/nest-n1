import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/* import { ConceitoModule } from './conceito/conceito.module';
import { CrudAutModule } from './crud-aut/crud-aut.module'; */
import { RecadosModule } from './recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroments } from 'enviroments/enviroments';
import { PessoasModule } from './pessoas/pessoas.module';
import { RolesModule } from './roles/roles.module';

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
    providers: [AppService],
})
export class AppModule {}

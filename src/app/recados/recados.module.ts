import { Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { RemoveSpacesRegex } from '../shared/regex/remove-spaces.regex';
import { ManterApenasLowerCase } from '../shared/regex/manter-apenas-lowerCase.regex';
import { enviroments } from 'enviroments/enviroments';
import { RegexFactory } from '../shared/regex/regex.factory';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Recado])],
    controllers: [RecadosController],
    providers: [
        RecadosService,
        RegexFactory,
        {
            provide: enviroments.variaveis.REMOVER_SPACES_REGEX,
            useFactory: (regexFactory: RegexFactory) => {
                return regexFactory.create('REMOVER_SPACES_REGEX');
            },
            inject: [RegexFactory],
        },
        {
            provide: enviroments.variaveis.APENAS_LOWER_CASE_REGEX,
            useFactory: (regexFactory: RegexFactory) => {
                return regexFactory.create('APENAS_LOWER_CASE_REGEX');
            },
            inject: [RegexFactory],
        },

        {
            provide: 'SERVER_NAME', //Forma de usar provider com valor específico
            useValue: enviroments.variaveis.serverName,
        },
        {
            provide: enviroments.variaveis.REMOVER_SPACES_REGEX,
            useClass: RemoveSpacesRegex,
        },
        {
            provide: enviroments.variaveis.APENAS_LOWER_CASE_REGEX,
            useClass: ManterApenasLowerCase,
        },
    ],
})
export class RecadosModule {}

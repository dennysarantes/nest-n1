import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Pessoa } from 'src/app/pessoas/entities/pessoa.entity';

/* eslint-disable prettier/prettier */
export class CreateRecadoDto {
    @IsString({
        message: getMensagemIncorreta(),
    })
    @IsNotEmpty({
        message: getMensagemIncorreta(),
    })
    @MinLength(5, {
        message: getMensagemMin(),
    })
    @MaxLength(250, {
        message: getMensagemMax(),
    })
    readonly texto: string;

    @IsNotEmpty({
        message: 'Destinatários são obrigatórios.',
    })
    readonly para: Pessoa[];

    constructor() {}
}

function getMensagemIncorreta(): string {
    return 'A mensagem está incorreta.';
}

function getMensagemMin(): string {
    return 'A mensagem deve ter no mínimo de 5 caracteres.';
}

function getMensagemMax(): string {
    return 'A mensagem deve ter no máximo de 250 caracteres.';
}

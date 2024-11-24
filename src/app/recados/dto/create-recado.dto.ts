import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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

    @IsString({
        message: getUserIncorreto(),
    })
    @IsNotEmpty({
        message: getUserIncorreto(),
    })
    @MaxLength(50, {
        message: getMensagemMax(),
    })
    readonly para: string;

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

function getUserIncorreto(): string {
    return 'O destinatário está incorreto.'
}

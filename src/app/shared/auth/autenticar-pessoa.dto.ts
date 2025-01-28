import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AutenticarPessoaDto {
    constructor() {}

    @IsEmail()
    @IsNotEmpty({
        message: 'email é obrigatório.',
    })
    readonly email: string;

    @IsString()
    @IsNotEmpty({
        message: 'Password é obrigatório.',
    })
    readonly password: string;
}

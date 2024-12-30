import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AutenticarPessoaDto {
    constructor() {}

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}

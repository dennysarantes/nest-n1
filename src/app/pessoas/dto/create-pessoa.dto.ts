import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { Role } from 'src/app/roles/entities/role.entity';

export class CreatePessoaDto {
    constructor() {}

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: 'Tamanho mínimo: 8 caracteres',
    })
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly nome: string;

    @IsOptional()
    readonly roles?: Role[];
}

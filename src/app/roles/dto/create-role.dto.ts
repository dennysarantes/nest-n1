import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    readonly nome: string;

    @IsString()
    @IsNotEmpty()
    readonly descricao: string;
}

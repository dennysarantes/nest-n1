import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
    @IsString({
        message: getUserIncorreto(),
    })
    @IsNotEmpty({
        message: getUserIncorreto(),
    })
    @IsOptional()
    public de: string;

    @IsBoolean()
    @IsOptional()
    public lido: boolean;

    @IsDate()
    @IsOptional()
    public data: Date;

    constructor() {
        super();
    }
}

function getUserIncorreto(): string {
    return 'O destinatário está incorreto.';
}

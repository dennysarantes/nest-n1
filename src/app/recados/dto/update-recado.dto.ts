import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Pessoa } from 'src/app/pessoas/entities/pessoa.entity';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {

    @IsOptional()
    readonly de: Pessoa;

    @IsOptional()
    @IsBoolean({
        message: 'O valor do campo lido deve ser true ou false'
    })
    readonly lido: boolean
}

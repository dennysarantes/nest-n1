import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatorDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
    @ApiProperty({
        description:
            'Limite de itens a serem retornados <p> <i>Exemplo: 4 </i></p>',
        example: 4,
    })
    limit: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(50)
    @Type(() => Number)
    @ApiProperty({
        description:
            'Número da página a ser retornada, sendo que a página 0 é a primeira <p> <i>Exemplo: 0 </i> </p>',
        example: 0,
    })
    page: number;
}

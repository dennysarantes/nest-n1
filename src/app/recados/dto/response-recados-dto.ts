import { ApiProperty } from '@nestjs/swagger';

class DataDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    texto: string;
}

export class ResponseRecadosDTO {
    @ApiProperty({ type: [DataDto] })
    data: DataDto[];
    @ApiProperty()
    totalElements: number;
    @ApiProperty()
    currentPage: number;
    @ApiProperty()
    totalPages: number;
}

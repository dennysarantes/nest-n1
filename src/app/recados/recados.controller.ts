import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
    HttpCode,
    HttpStatus,
    Query,
    Res,
    //HttpException,
    BadRequestException,
    ParseIntPipe,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Response } from 'express';

@Controller('recados')
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {}

    @Get()
    findAll(@Headers() headers) {
        console.log('Os headers: ', headers);
        return this.recadosService.findAll();
    }

    // Resposta com status code alterado!
    @HttpCode(HttpStatus.AMBIGUOUS)
    @Get('todos')
    findAllModificado(@Query() paginacao: any) {
        const { limite = 10, offset = 0 } = paginacao;

        return {
            mensagem: 'Essa rota tem um status cod específico',
            limite,
            offset,
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const recado = await this.recadosService.findOne(id);
        if (recado) {
            return res.status(200).json(recado);
        } else {
            throw new BadRequestException('Recado não encontrado.');

            /* throw new HttpException(
                'Recado não encontrado.',
                HttpStatus.BAD_REQUEST,
            ); */
        }
    }

    @Post()
    create(@Body() createRecadoDto: CreateRecadoDto) {
        return this.recadosService.create(createRecadoDto);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRecadoDto: UpdateRecadoDto,
        @Res() res: Response,
    ) {
        if (!id) {
            throw new BadRequestException('O parâmetro ID é obrigatório');
        }
        const upd = await this.recadosService.update(id, updateRecadoDto);

        return upd === null
            ? res.status(400).json({ mensagem: 'Recado inexistente.' })
            : upd;
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.recadosService.remove(id);
    }
}
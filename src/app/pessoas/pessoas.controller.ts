import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AutenticarPessoaDto } from './dto/autenticar-pessoa.dto';

@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Post('/autenticar')
    autenticar(@Body() autenticarPessoaDto: AutenticarPessoaDto) {
        console.log('autenticarPessoaDto: ', autenticarPessoaDto);
        return 'token'; //this.pessoasService.create(createPessoaDto);
    }

    @Post()
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }

    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pessoasService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
        return this.pessoasService.update(+id, updatePessoaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pessoasService.remove(+id);
    }
}

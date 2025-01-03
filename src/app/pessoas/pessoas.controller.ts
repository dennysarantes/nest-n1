import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from '../shared/guards/AuthTokenGuard';
import { TokenPayloadParam } from '../shared/auth/params/token-payload-params';
import { TokenPayloadDto } from '../shared/auth/dto/token-payload-dto';


@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}


    @UseGuards(AuthTokenGuard)
    @Post()
    create(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @UseGuards(AuthTokenGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pessoasService.findOne(+id);
    }

    @UseGuards(AuthTokenGuard)
    @Patch(':id')
    update(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {

        return this.pessoasService.update(+id, updatePessoaDto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    remove(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Param('id') id: string) {
        return this.pessoasService.remove(+id, tokenPayload);
    }
}

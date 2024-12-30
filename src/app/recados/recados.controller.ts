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
    //ParseIntPipe,
    UsePipes,
    UseInterceptors,
    Req,
    Inject,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Request, Response } from 'express';
import { PaginatorDto } from '../shared/dto/paginator.dto';
import { ParseIntIdPipe } from '../shared/pipes/id.pipe';
import { AddHeaderInterceptor } from '../shared/interceptors/add.header.interceptor';
import { ErrorLogInterceptor } from '../shared/interceptors/error.log.interceptor';
import { UrlParam } from '../shared/custom-params/get-url.param';
//import { RegexProtocol } from '../shared/regex/regex.protocol';
import { enviroments } from 'enviroments/enviroments';
import { ManterApenasLowerCase } from '../shared/regex/manter-apenas-lowerCase.regex';
import { RemoveSpacesRegex } from '../shared/regex/remove-spaces.regex';
import { ConfigService } from '@nestjs/config';

@Controller('recados')
@UsePipes(ParseIntIdPipe)
export class RecadosController {
    constructor(
        private readonly configService: ConfigService,

        private readonly recadosService: RecadosService,
        @Inject('SERVER_NAME')
        private readonly serverName: string,

        /* @Inject(enviroments.variaveis.REMOVER_SPACES_REGEX)
        private readonly removerSpacesRegex: RegexProtocol,

        @Inject(enviroments.variaveis.APENAS_LOWER_CASE_REGEX)
        private readonly apenasLowerCaseRegex: RegexProtocol, */

        @Inject(enviroments.variaveis.APENAS_LOWER_CASE_REGEX)
        private readonly apenasLowerCaseRegex: ManterApenasLowerCase,

        @Inject(enviroments.variaveis.REMOVER_SPACES_REGEX)
        private readonly removerSpacesRegex: RemoveSpacesRegex,
    ) {
        console.log(
            'dados de variáveis: ',
            configService.get('DATABASE_USERNAME'),
        );

        console.log('Server Name:', serverName);
        console.log(removerSpacesRegex.execute('Server Name:' + serverName));
        console.log(apenasLowerCaseRegex.execute('ApenasLetrasMinúsculas'));
    }

    @Get()
    @UseInterceptors(AddHeaderInterceptor, ErrorLogInterceptor)
    findAll(@Headers() headers, @Query() paginatorDto?: PaginatorDto) {
        console.log('controller...');
        return this.recadosService.findAll(paginatorDto);
    }

    // Resposta com status code alterado!
    @HttpCode(HttpStatus.AMBIGUOUS)
    @Get('todos')
    findAllModificado(@Query() paginatorDto?: PaginatorDto) {
        const { limit = 10, page = 0 } = paginatorDto;

        return {
            mensagem: 'Essa rota tem um status cod específico',
            limit,
            page,
        };
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
        @UrlParam() url?: string,
    ) {
        console.log('url buscada pelo customParam: ', url);
        const recado = await this.recadosService.findOne(id);
        const user = req['user'];

        console.log('user: ', user);

        if (recado) {
            console.log('entrou no controller...');
            res.appendHeader('teste', '12343');
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
        console.log('createRecadoDto: ', createRecadoDto);
        return this.recadosService.create(createRecadoDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updateRecadoDto: UpdateRecadoDto,
        @Res() res: Response,
    ) {
        if (!id) {
            throw new BadRequestException('O parâmetro ID é obrigatório');
        }

        const upd = await this.recadosService.update(id, updateRecadoDto);

        return upd === null
            ? res.status(400).json({ mensagem: 'Recado inexistente.' })
            : res.status(200).json(upd);
    }

    @Delete(':id')
    remove(@Param('id' /* , ParseIntPipe */) id: number) {
        return this.recadosService.remove(id);
    }
}

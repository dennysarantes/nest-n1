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
    UseGuards,
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
import appConfig from '../app.config';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
//import { TOKEN_PAYLOAD } from '../shared/auth/auth.constants';
import { AuthTokenGuard } from '../shared/guards/AuthTokenGuard';
import { TokenPayloadParam } from '../shared/auth/params/token-payload-params';
import { TokenPayloadDto } from '../shared/auth/dto/token-payload-dto';

@Controller('recados')
@UsePipes(ParseIntIdPipe)
@UseGuards(AuthTokenGuard)
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

        @Inject(appConfig.KEY)
        private readonly appConf: ConfigType<typeof appConfig>,
    ) {
        /*  console.log(
            'dados de variáveis: ',
            configService.get('DATABASE_USERNAME'),
        ); */
        /* console.log('Server Name:', serverName);
        console.log(removerSpacesRegex.execute('Server Name:' + serverName));
        console.log(apenasLowerCaseRegex.execute('ApenasLetrasMinúsculas'));
        console.log('App config', appConf.database.database); */
    }

    @Get()
    @UseInterceptors(AddHeaderInterceptor, ErrorLogInterceptor)
    findAll(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Headers() headers,
        @Query() paginatorDto?: PaginatorDto,
    ) {
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
    create(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Body() createRecadoDto: CreateRecadoDto,
    ) {
        console.log('createRecadoDto: ', createRecadoDto);
        return this.recadosService.create(createRecadoDto, tokenPayload);
    }

    @Patch(':id')
    async update(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Param('id') id: number,
        @Body() updateRecadoDto: UpdateRecadoDto,
        @Res() res: Response,
    ) {
        if (!id) {
            throw new BadRequestException('O parâmetro ID é obrigatório');
        }

        const upd = await this.recadosService.update(
            id,
            updateRecadoDto,
            tokenPayload,
        );

        return upd === null
            ? res.status(400).json({ mensagem: 'Recado inexistente.' })
            : res.status(200).json(upd);
    }

    @Delete(':id')
    remove(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Param('id' /* , ParseIntPipe */) id: number,
    ) {
        console.log('id: ', id);
        return this.recadosService.remove(id, tokenPayload);
    }
}

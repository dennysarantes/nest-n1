import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from '../shared/guards/AuthTokenGuard';
import { TokenPayloadParam } from '../shared/auth/params/token-payload-params';
import { TokenPayloadDto } from '../shared/auth/dto/token-payload-dto';
import { TiposRolesEnum } from '../roles/model/tipos-roles.enum';
import { RoutePolicyGuard } from '../shared/guards/route-policy.guard';
import { SetRoutePolicy } from '../shared/decorators/set-route-policy.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(RoutePolicyGuard)
@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @UseGuards(AuthTokenGuard)
    @Post()
    //@SetRoutePolicy(TiposRolesEnum.ADMIN, 'criar_usuario') //Rota exclusiva para admins
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }

    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(TiposRolesEnum.USERS, 'buscar_usuarios')
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
        @Param('id') id: string,
        @Body() updatePessoaDto: UpdatePessoaDto,
    ) {
        return this.pessoasService.update(+id, updatePessoaDto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    remove(
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
        @Param('id') id: string,
    ) {
        return this.pessoasService.remove(+id, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @UseInterceptors(FileInterceptor('foto'))
    @Post('upload-foto-banco')
    uploadFotoBanco(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 0.5 * (1024 * 1024) }), // 500 KB
                    new FileTypeValidator({ fileType: /jpe|jpg|png/g }),
                ],
            }),
        )
        foto: Express.Multer.File,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    ) {
        return this.pessoasService.uploadFotoNoBanco(foto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @UseInterceptors(FileInterceptor('foto'))
    @Post('upload-foto-file-system')
    uploadFotoFileSystem(
        @UploadedFile() foto: Express.Multer.File,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    ) {
        return this.pessoasService.uploadFotoFileSystem(foto, tokenPayload);
    }
}

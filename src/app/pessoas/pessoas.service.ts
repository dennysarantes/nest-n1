import {
    BadRequestException,
    Injectable,
    NotFoundException,
    NotImplementedException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { HashingServiceProtocol } from '../shared/auth/hashing/hashing.service';
import { TokenPayloadDto } from '../shared/auth/dto/token-payload-dto';
import { UtilShared } from '../shared/util.shared';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PessoasService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,

        private readonly hashingService: HashingServiceProtocol,
    ) {}

    async create(createPessoaDto: CreatePessoaDto) {
        try {
            const hash = await this.hashingService.hash(
                createPessoaDto.password,
            );

            const novaPessoa = new Pessoa(
                createPessoaDto.email,
                hash,
                createPessoaDto.nome,
                createPessoaDto?.roles,
            );

            return await this.pessoaRepository.save(novaPessoa);
        } catch (error) {
            /*      console.log(
                'Descrição do erro: ',
                error.detail ?? 'erro desconhecido',
            ); */
            throw new NotImplementedException('Erro: ' + error?.detail);
        }
    }

    async findAll() {
        const pessoas = await this.pessoaRepository.find();
        return pessoas;
    }

    async findOne(id: number) {
        const pessoa = await this.pessoaRepository.findOne({
            where: {
                id,
            },
        });

        return pessoa;
    }

    async findByEmail(email: string) {
        const pessoa = await this.pessoaRepository.findOne({
            where: {
                email,
            },
        });

        return pessoa;
    }

    // Sé é permitido atualizar o nome e password da pessoa.
    async update(
        id: number,
        updatePessoaDto: UpdatePessoaDto,
        tokenPayload: TokenPayloadDto,
    ) {
        const passwordHash = await this.hashingService.hash(
            updatePessoaDto.password,
        );

        const pessoa = await this.pessoaRepository.preload({
            id,
            //...updatePessoaDto,
            nome: updatePessoaDto.nome,
            passwordHash,
            roles: updatePessoaDto.roles,
        });

        if (!pessoa) {
            throw new NotFoundException('Pessoa não encontrada');
        } else {
            if (
                !UtilShared.tokenEhDoUsuario(tokenPayload, pessoa.id) &&
                !UtilShared.usuarioEhAdmin(tokenPayload)
            ) {
                throw new UnauthorizedException(
                    'Usuário não possui permissão para realizar a ação.',
                );
            }

            const pessoaAtualizada = await this.pessoaRepository.save(pessoa);

            return {
                mensagem: `Pessoa id: #${id} atualizada com sucesso`,
                pessoaAtualizada,
            };
        }
    }

    async remove(id: number, tokenPayload: TokenPayloadDto) {
        const pessoaEncontrada = await this.findOne(id);

        if (pessoaEncontrada) {
            if (!UtilShared.usuarioEhAdmin(tokenPayload)) {
                throw new UnauthorizedException(
                    'Usuário não possui permissão para realizar a ação.',
                );
            }

            await this.pessoaRepository.delete(id);
            return 'Pessoa removida com sucesso';
        } else {
            return 'Id inexistente';
        }
    }

    async uploadFotoNoBanco(
        file: Express.Multer.File,
        tokenPayload: TokenPayloadDto,
    ) {
        try {
            // Verifica se o arquivo foi fornecido corretamente
            this.ehFileValido(file);
            const fileExtension = this.getFileExtention(file);

            const fileName = `${tokenPayload.sub}.${fileExtension}`;
            //console.log('fileName: ', fileName);

            // Atualiza a entidade Pessoa com a nova foto
            const pessoa: Pessoa = await this.pessoaRepository.findOne({
                where: { id: Number(tokenPayload.sub) },
            });

            pessoa.foto = file.buffer;
            pessoa.nomeFoto = fileName;

            await this.pessoaRepository.save(pessoa);

            return { mesagem: 'Foto salva com sucesso!' };
        } catch (error) {
            //console.error(error);
            throw error;
        }
    }

    async uploadFotoFileSystem(
        file: Express.Multer.File,
        tokenPayload: TokenPayloadDto,
    ) {
        try {
            this.ehFileValido(file);
            const fileExtension = this.getFileExtention(file);

            const fileName = `${tokenPayload.sub + '_' + Date.now().toString()}.${fileExtension}`;
            const fileFullPath = path.resolve(
                process.cwd(),
                'pictures',
                fileName,
            );

            //console.log('escrevendo arquivo:');
            await fs.writeFile(fileFullPath, file.buffer);

            return {
                mensagem: 'Imagem salva na pasta pictures com sucesso.',
                fieldname: file.fieldname,
                originalname: file.originalname,
            };
        } catch (error) {
            //console.error('Aconteceu um erro:', error);
            throw error;
        }
    }

    ehFileValido(file: Express.Multer.File) {
        if (
            !file ||
            !file.buffer ||
            file.size < 50 * 1024 ||
            file.size > 999999
        ) {
            //console.log('Entrou aqui...');
            throw new BadRequestException(
                'Imagem inválida.Tamanho mínimo: 50Kb e  Tamanho máximo: 1MB',
            );
        }
    }

    getFileExtention(file: Express.Multer.File) {
        try {
            return path
                ?.extname(file?.originalname)
                ?.toLocaleLowerCase()
                ?.substring(1);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            //console.error('Erro: ', error);
            throw new BadRequestException('Arquivo inválido');
        }
    }
}

import {
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
                createPessoaDto.roles,
            );

            const pessoaCriada = await this.pessoaRepository.save(novaPessoa);
            return pessoaCriada;
        } catch (error) {
            console.log('Descrição do erro: ', error.detail);
            throw new NotImplementedException('Erro: ' + error.detail);
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
}

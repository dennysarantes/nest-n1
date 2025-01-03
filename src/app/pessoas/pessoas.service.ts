import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { UtilShared } from '../shared/util.shared';
import { BcryptServiceProtocol } from '../shared/auth/hashing/bcrypt.service';
import { HashingServiceProtocol } from '../shared/auth/hashing/hashing.service';
import { TokenPayloadDto } from '../shared/auth/dto/token-payload-dto';
import { TiposRolesEnum } from '../roles/model/tipos-roles.enum';

@Injectable()
export class PessoasService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,

        private readonly hashingService: HashingServiceProtocol
    ) {}

    async create(createPessoaDto: CreatePessoaDto, tokenPayload:TokenPayloadDto) {
        try {

            if(!tokenPayload?.roles?.includes(TiposRolesEnum.ADMIN.toLocaleLowerCase())){
                throw new UnauthorizedException('Usuário não possui permissão necessária para a ação.');
            }

            console.log('createPessoaDto: ', createPessoaDto);
            const hash = await this.hashingService.hash(createPessoaDto.password);

            const novaPessoa = new Pessoa(
                createPessoaDto.email,
                hash,
                createPessoaDto.nome,
                createPessoaDto.roles,
            );

            console.log('novaPessoa: ', novaPessoa);
            const pessoaCriada = await this.pessoaRepository.save(novaPessoa);
            return pessoaCriada;
        } catch (error) {
            if (error.code == '23503') {
                throw new ConflictException('email já cadastrado');
            }

            throw error;
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
    async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {


        const passwordHash = await this.hashingService.hash(updatePessoaDto.password);

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

            if(
                    pessoa.id.toString() !== tokenPayload.sub.toString() &&
                    !tokenPayload?.roles?.includes(TiposRolesEnum.ADMIN.toLocaleLowerCase())){

                    throw new UnauthorizedException('Usuário não possui permissão para realizar a ação.');

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

            if(
                pessoaEncontrada.id.toString() !== tokenPayload.sub.toString() &&
                !tokenPayload?.roles?.includes(TiposRolesEnum.ADMIN.toLocaleLowerCase())){

                throw new UnauthorizedException('Usuário não possui permissão para realizar a ação.');

        }

            await this.pessoaRepository.delete(id);
            return 'Pessoa removida com sucesso';
        } else {
            return 'Id inexistente';
        }
    }
}

import { Injectable } from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from './entities/recado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatorDto } from '../shared/dto/paginator.dto';

@Injectable()
export class RecadosService {
    constructor(
        @InjectRepository(Recado)
        private readonly recadoRepository: Repository<Recado>,
    ) {}

    async create(createRecadoDto: CreateRecadoDto) {
        const novoRecado = new Recado(
            createRecadoDto.texto,
            createRecadoDto.de,
            createRecadoDto.para,
            false,
            new Date(),
        );

        const recadoCriado = await this.recadoRepository.save(novoRecado);

        return recadoCriado;
    }

    async findAll(paginator?: PaginatorDto) {
        console.log('service....');
        const { limit = 10, page = 0 } = paginator;
        const offset = page * limit;

        const [results, total] = await this.recadoRepository
            .createQueryBuilder('recados')
            /* .orderBy('id', 'DESC')
            .select(['id', 'texto']) */
            .select(['recados.id', 'recados.texto'])
            .orderBy('recados.id', 'DESC')
            .take(limit)
            .skip(offset)
            .getManyAndCount();

        /*         const recados = await this.recadoRepository.findAndCount({
            take: limit,
            skip: offset + 1,
            order: {
                id: 'desc',
            },
            relations: ['de', 'para'],
            select: {
                id: true,
                texto: true,
                lido: true,
                de: {
                    id: true,
                    email: true,
                },
                para: {
                    id: true,
                    email: true,
                },
            },
        }); */

        /*  const resposta = {
            conteudo: [...recados[0]],
            paginacao: {
                limit,
                offset,
                totalPaginas: recados[1],
            },
        }; */

        return {
            data: [...results],
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const recado = await this.recadoRepository.findOne({
            where: {
                id,
            },
        });

        return recado;
    }

    async update(id: number, updateRecadoDto: UpdateRecadoDto) {
        const recado = await this.recadoRepository.preload({
            id,
            ...updateRecadoDto,
        });

        if (!recado) {
            return null;
        } else {
            const recadoAtualizado = await this.recadoRepository.save(recado);

            return {
                mensagem: `Recado id: #${id} atualizado com sucesso`,
                recadoAtualizado,
            };
        }
    }

    // Esta é uma outra forma de fazer upload
    async updateOld(id: number, updateRecadoDto: UpdateRecadoDto) {
        console.log('updateRecadoDto: ', updateRecadoDto);
        const recadoEncontrado = await this.findOne(id);

        if (!recadoEncontrado) {
            return null;
        } else {
            const recadoAtualizado = await this.recadoRepository
                .createQueryBuilder()
                .update()
                .set({
                    ...updateRecadoDto,
                })
                .where('id = :id', { id })
                .execute();

            return {
                mensagem: `Recado id: #${id} atualizado com sucesso`,
                recadoAtualizado,
            };
        }
    }

    async remove(id: number) {
        const recadoEncontrado = await this.findOne(id);

        if (recadoEncontrado) {
            await this.recadoRepository.delete(id);
            return 'Recado removido com sucesso';
        } else {
            return 'Id inexistente';
        }
    }
}

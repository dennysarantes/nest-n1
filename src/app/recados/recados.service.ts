import { Injectable } from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from './entities/recado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
    constructor(
        @InjectRepository(Recado)
        private readonly recadoRepository: Repository<Recado>,
    ) {}

    async create(createRecadoDto: CreateRecadoDto) {
        const novoRecado = new Recado(
            createRecadoDto.texto,
            'Usuário do header',
            createRecadoDto.para,
            false,
            new Date(),
        );

        const recadoCriado = await this.recadoRepository.save(novoRecado);

        return recadoCriado;
    }

    async findAll() {
        const recados = await this.recadoRepository.find();
        return recados;
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

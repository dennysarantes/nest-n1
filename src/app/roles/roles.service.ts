import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        const novaRole = new Role(createRoleDto.nome, createRoleDto.descricao);
        const roleCriada = await this.roleRepository.save(novaRole);
        return roleCriada;
    }

    async findAll() {
        const roles = await this.roleRepository.find();
        return roles;
    }

    async findOne(id: number) {
        const roles = await this.roleRepository.findOne({
            where: {
                id,
            },
        });

        return roles;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        const role = await this.roleRepository.preload({
            id,
            ...updateRoleDto,
        });

        if (!role) {
            return null;
        } else {
            const roleAtualizado = await this.roleRepository.save(role);

            return {
                mensagem: `Role id: #${id} atualizada com sucesso`,
                roleAtualizado,
            };
        }
    }

    async remove(id: number) {
        const roleEncontrado = await this.findOne(id);

        if (roleEncontrado) {
            await this.roleRepository.delete(id);
            return 'Role removido com sucesso';
        } else {
            return 'Id inexistente';
        }
    }
}

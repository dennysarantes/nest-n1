import { Injectable } from '@nestjs/common';
import { CreateCrudAutDto } from './dto/create-crud-aut.dto';
import { UpdateCrudAutDto } from './dto/update-crud-aut.dto';

@Injectable()
export class CrudAutService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(createCrudAutDto: CreateCrudAutDto) {
        return 'This action adds a new crudAut';
    }

    findAll() {
        return `This action returns all crudAut`;
    }

    findOne(id: number) {
        return `This action returns a #${id} crudAut`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(id: number, updateCrudAutDto: UpdateCrudAutDto) {
        return `This action updates a #${id} crudAut`;
    }

    remove(id: number) {
        return `This action removes a #${id} crudAut`;
    }
}

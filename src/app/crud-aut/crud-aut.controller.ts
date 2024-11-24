import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CrudAutService } from './crud-aut.service';
import { CreateCrudAutDto } from './dto/create-crud-aut.dto';
import { UpdateCrudAutDto } from './dto/update-crud-aut.dto';

@Controller('crud-aut')
export class CrudAutController {
    constructor(private readonly crudAutService: CrudAutService) {}

    @Post()
    create(@Body() createCrudAutDto: CreateCrudAutDto) {
        return this.crudAutService.create(createCrudAutDto);
    }

    @Get()
    findAll() {
        return this.crudAutService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.crudAutService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCrudAutDto: UpdateCrudAutDto,
    ) {
        return this.crudAutService.update(+id, updateCrudAutDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.crudAutService.remove(+id);
    }
}

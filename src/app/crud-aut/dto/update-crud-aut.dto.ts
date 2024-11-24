import { PartialType } from '@nestjs/mapped-types';
import { CreateCrudAutDto } from './create-crud-aut.dto';

export class UpdateCrudAutDto extends PartialType(CreateCrudAutDto) {}

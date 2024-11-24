import { Module } from '@nestjs/common';
import { CrudAutService } from './crud-aut.service';
import { CrudAutController } from './crud-aut.controller';

@Module({
    controllers: [CrudAutController],
    providers: [CrudAutService],
})
export class CrudAutModule {}

import { Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Recado])],
    controllers: [RecadosController],
    providers: [RecadosService],
})
export class RecadosModule {}

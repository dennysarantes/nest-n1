import { Module } from '@nestjs/common';
import { ConceitosController } from './conceito.controller';
import { ConceitosService } from './conceito.service';

@Module({
    imports: [],
    controllers: [ConceitosController],
    providers: [ConceitosService],
})
export class ConceitoModule {}

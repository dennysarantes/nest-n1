// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Req } from '@nestjs/common';
import { ConceitosService } from './conceito.service';

@Controller('conceitos')
export class ConceitosController {
    constructor(private conceitosService: ConceitosService) {}

    @Get('/teste')
    getConceitos(): any {
        return this.conceitosService.getConceitos();
    }
}

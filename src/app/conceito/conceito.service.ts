import { Injectable } from '@nestjs/common';
import { ConceitosReturnTeste } from './model/conceitos-tipo.model';

@Injectable()
export class ConceitosService {
    getConceitos(): any {
        return new ConceitosReturnTeste('Nome', 'Descrição!!');
    }
}

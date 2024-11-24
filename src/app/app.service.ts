import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello() {
        return { mensagem: 'OK, app em funcionamento.' };
    }
}

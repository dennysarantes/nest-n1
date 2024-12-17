import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('Pipe...');

        if (metadata.type !== 'param' || metadata.data != 'id') {
            return value;
        }

        const idParsed = parseInt(value);

        if (isNaN(idParsed)) {
            throw new BadRequestException(
                'O parâmetro deve ser um número inteiro.',
            );
        }

        return idParsed;
    }
}

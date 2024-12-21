import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegexProtocol } from './regex.protocol';
import { ManterApenasLowerCase } from './manter-apenas-lowerCase.regex';
import { RemoveSpacesRegex } from './remove-spaces.regex';

export type ClassNames = 'REMOVER_SPACES_REGEX' | 'APENAS_LOWER_CASE_REGEX';

@Injectable()
export class RegexFactory {
    create(className: ClassNames): RegexProtocol {
        // Meu código/lógica
        switch (className) {
            case 'APENAS_LOWER_CASE_REGEX':
                return new ManterApenasLowerCase();
            case 'REMOVER_SPACES_REGEX':
                return new RemoveSpacesRegex();
            default:
                throw new InternalServerErrorException(
                    `No class found for ${className}`,
                );
        }
    }
}

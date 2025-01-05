import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TiposRolesEnum } from 'src/app/roles/model/tipos-roles.enum';
import { TOKEN_PAYLOAD } from '../auth/auth.constants';
import { UtilShared } from '../util.shared';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log('Guard Route Policy...');

        // Controle de rotas de administradores:
        const ehExclusivaAdmin = this.reflector.get(
            TiposRolesEnum.ADMIN,
            context.getHandler(),
        );

        if (
            ehExclusivaAdmin &&
            !UtilShared.usuarioEhAdmin(getPayload(context))
        ) {
            throw new ForbiddenException(
                'Usuário não possui permissão para acessar este serviço.',
            );
        }

        const { authorization } = context.switchToHttp().getRequest().headers;
        console.log('authorization: ', authorization);

        return true;
    }
}

function getPayload(context) {
    const contexto = context.switchToHttp();
    const request: Request = contexto.getRequest();
    return request[TOKEN_PAYLOAD];
}

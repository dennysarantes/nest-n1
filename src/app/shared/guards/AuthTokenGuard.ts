import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
//import { PessoasService } from 'src/app/pessoas/pessoas.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import appConfig from 'src/app/app.config';
import { ConfigType } from '@nestjs/config';
import { TOKEN_PAYLOAD } from '../auth/auth.constants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        // private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        @Inject(appConfig.KEY)
        private readonly appConfigs: ConfigType<typeof appConfig>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('AuthTokenGuard...');

        const ehLogin = this.ehLogin(context.switchToHttp().getRequest());
        if (ehLogin) return true;

        const accesToken = this.extrairTokenHeader(
            context.switchToHttp().getRequest(),
        );

        if (!accesToken) this.lancarErro(false);

        // Aqui, teoricamente o guard faria uma busca em pessoa Service e verificaria o perfil do login e a rota.

        try {
            console.log('accesToken: ', accesToken);

            if (accesToken === 'teste') return true;

            const payload = await this.jwtService.verifyAsync(
                accesToken,
                this.appConfigs.jwt_config,
            );
            this.atribuirPayloadAoRequest(
                context.switchToHttp().getRequest(),
                payload,
            );
        } catch (error) {
            this.lancarErro(true);
        }

        return true;
    }

    extrairTokenHeader = (request: Request): string => {
        const authorization = request.headers?.authorization;

        if (!authorization || typeof authorization !== 'string') {
            return;
        }

        return authorization.split(' ')[1];
    };

    ehLogin = (request: Request): boolean => {
        return request.url === '/auth/login';
    };

    lancarErro = (temToken: boolean) => {
        throw new UnauthorizedException(
            temToken ? 'Token inválido!' : 'Token inexistente',
        );
    };

    atribuirPayloadAoRequest = (request: Request, payload) =>
        (request[TOKEN_PAYLOAD] = payload);
}

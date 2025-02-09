/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from 'src/app/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';
import { AutenticarPessoaDto } from './autenticar-pessoa.dto';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/app/app.config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(appConfig.KEY)
        private readonly appConfigs: ConfigType<typeof appConfig>,
        private readonly jwtService: JwtService,
    ) {}

    async login(dados: AutenticarPessoaDto) {
        let senhaCorreta = false;
        const email = dados?.email;

        const pessoaExiste = await this.buscarPessoa(email);

        if (pessoaExiste?.length === 1) {
            senhaCorreta = await this.hashingService.compare(
                dados.password,
                pessoaExiste[0].passwordhash,
            );
        }

        if (!pessoaExiste.length || !senhaCorreta) {
            throw new UnauthorizedException('Senha ou Email inválido.');
        }

        const accessToken = await this.gerarToken(
            pessoaExiste[0],
            this.appConfigs.jwt_config.ttl,
        );

        return { mensagem: 'Usuario logado', token: accessToken };
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new NotFoundException('Token não encontrado');
        }

        const id = this.jwtService.decode(refreshToken)['sub'];

        const pessoa = await this.buscarPessoa(null, id);

        if (pessoa?.length != 1) {
            throw new NotFoundException('Token inválido');
        }

        try {
            this.jwtService.verify(refreshToken, {
                audience: this.appConfigs.jwt_config.audience,
                issuer: this.appConfigs.jwt_config.issue,
                secret: this.appConfigs.jwt_config.secret,
            });

            const accessToken = await this.gerarToken(
                pessoa[0],
                this.appConfigs.jwt_config.ttlRefresh,
            );

            return { mensagem: 'Token renovado', token: accessToken };
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Assinatura Inválida');
            }
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token Expirado');
            }
            throw new UnauthorizedException(err.name);
        }
    }

    private async buscarPessoa(email?: string, id?: string) {
        const condicao: string = `${email ? 'email' : 'id'}`;
        const valor = email ? { email } : { id };

        return await this.pessoaRepository
            .createQueryBuilder('p')
            .select([
                'p.id as id',
                'p.email as email',
                'p.passwordHash as passwordhash',
                'json_agg(r.nome) AS roles',
            ])
            .innerJoin('p.roles', 'r') // Assumindo que a entidade Pessoa tem uma relação com Role chamada "roles"
            .where(`p.${condicao} = :${condicao}`, { ...valor })
            .groupBy('p.id, p.email')
            .getRawMany(); // Para obter os dados no formato da consulta SQL
    }

    private async gerarToken(pessoa: Pessoa, expiresIn) {
        return await this.jwtService.signAsync(
            {
                sub: pessoa.id,
                email: pessoa.email,
                roles: pessoa.roles,
            },
            {
                audience: this.appConfigs.jwt_config.audience,
                issuer: this.appConfigs.jwt_config.issue,
                secret: this.appConfigs.jwt_config.secret,
                expiresIn,
            },
        );
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AutenticarPessoaDto } from 'src/app/shared/auth/autenticar-pessoa.dto';
import { AuthService } from './auth.service';
import { AuthTokenGuard } from '../guards/AuthTokenGuard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayloadParam } from './params/token-payload-params';
import { TokenPayloadDto } from './dto/token-payload-dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('/login')
    async autenticar(@Body() autenticarPessoaDto: AutenticarPessoaDto) {
        console.log('autenticarPessoaDto: ', autenticarPessoaDto);

        return await this.authService.login(autenticarPessoaDto);
    }

    @Post('/renovar')
    async renovarToken(@Body() body: any) {
        const { refreshToken } = body;
        return await this.authService.refreshToken(refreshToken);
    }
}

import { Body, Controller, Post } from "@nestjs/common";
import { AutenticarPessoaDto } from "src/app/shared/auth/autenticar-pessoa.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{

        constructor(private readonly authService: AuthService){}

       @Post('/autenticar')
       async autenticar(@Body() autenticarPessoaDto: AutenticarPessoaDto) {
            console.log('autenticarPessoaDto: ', autenticarPessoaDto);

            return  await this.authService.autenticar(autenticarPessoaDto);
        }



}

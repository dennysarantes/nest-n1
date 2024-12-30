import { ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pessoa } from "src/app/pessoas/entities/pessoa.entity";
import { PessoasService } from "src/app/pessoas/pessoas.service";
import { Repository } from "typeorm";
import { AutenticarPessoaDto } from "./autenticar-pessoa.dto";
import { HashingServiceProtocol } from "./hashing/hashing.service";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly pessoaService:PessoasService,
        private readonly hashingService: HashingServiceProtocol
    ){}

    async autenticar(dados:AutenticarPessoaDto){
      let senhaCorreta = false;
      const pessoaExiste =  await this.pessoaService.findByEmail(dados.email);

      if(pessoaExiste){
            senhaCorreta = await this.hashingService.compare(dados.password, pessoaExiste.passwordHash);
      }

       if(!pessoaExiste || !senhaCorreta){
        throw new UnauthorizedException("Senha ou Email inválido.");
       }

       return {mensagem: 'Usuario logado', token: 'XPTO'}

    }


}

import { forwardRef, Global, Module } from "@nestjs/common";
import { HashingServiceProtocol } from "./hashing/hashing.service";
import { BcryptServiceProtocol } from "./hashing/bcrypt.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pessoa } from "src/app/pessoas/entities/pessoa.entity";
import { PessoasModule } from "src/app/pessoas/pessoas.module";

@Global()
@Module({
    imports:[
        forwardRef(() => PessoasModule),
        TypeOrmModule.forFeature([Pessoa]),
    ],
    providers: [
        {
            provide: HashingServiceProtocol,
            useClass: BcryptServiceProtocol
        },
        AuthService
    ],
    exports: [
        HashingServiceProtocol
    ],
    controllers:[AuthController]

})
export class AuthModule {}

import { forwardRef, Global, Module } from "@nestjs/common";
import { HashingServiceProtocol } from "./hashing/hashing.service";
import { BcryptServiceProtocol } from "./hashing/bcrypt.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pessoa } from "src/app/pessoas/entities/pessoa.entity";
import { PessoasModule } from "src/app/pessoas/pessoas.module";
import { ConfigModule, ConfigType } from "@nestjs/config";
import appConfig from "src/app/app.config";
import { JwtModule, } from "@nestjs/jwt";

@Global()
@Module({
    imports:[
        forwardRef(() => PessoasModule),
        TypeOrmModule.forFeature([Pessoa]),
        ConfigModule.forFeature(appConfig),
        JwtModule.registerAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: (appConfg: ConfigType<typeof appConfig>) => {
                return {
                        secret: appConfg.jwt_config.secret,
                        signOptions:{
                            expiresIn: appConfg.jwt_config.ttl,
                            audience: appConfg.jwt_config.audience,
                            issuer: appConfg.jwt_config.issue
                        }
                }
            }
        })
    ],
    providers: [
        {
            provide: HashingServiceProtocol,
            useClass: BcryptServiceProtocol
        },
        AuthService,
    ],
    exports: [
        HashingServiceProtocol,
        AuthService,
        JwtModule,
        ConfigModule
    ],
    controllers:[AuthController]

})
export class AuthModule {}

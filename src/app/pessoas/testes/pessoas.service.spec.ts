import { Repository } from 'typeorm';
import { PessoasService } from '../pessoas.service';
import { Pessoa } from '../entities/pessoa.entity';
import { HashingServiceProtocol } from 'src/app/shared/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import {
    BadRequestException,
    NotFoundException,
    NotImplementedException,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/app/roles/entities/role.entity';
import { UtilShared } from 'src/app/shared/util.shared';
import { TokenPayloadDto } from 'src/app/shared/auth/dto/token-payload-dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { UpdatePessoaDto } from '../dto/update-pessoa.dto';

describe('pessoasServiceTeste', () => {
    let pessoasService: PessoasService;
    let pessoaRepository: Repository<Pessoa>;
    let hashingService: HashingServiceProtocol;

    jest.mock('path', () => ({
        ...jest.requireActual('path'),
        resolve: jest.fn(),
    }));

    jest.mock('fs/promises', () => ({
        writeFile: jest.fn(),
    }));

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PessoasService,
                {
                    provide: getRepositoryToken(Pessoa),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        delete: jest.fn(),
                        preload: jest.fn(),
                    },
                },
                {
                    provide: HashingServiceProtocol,
                    useValue: {
                        hash: jest.fn(),
                    },
                },
            ],
        }).compile();

        pessoasService = module.get<PessoasService>(PessoasService);
        pessoaRepository = module.get<Repository<Pessoa>>(
            getRepositoryToken(Pessoa),
        );
        hashingService = module.get<HashingServiceProtocol>(
            HashingServiceProtocol,
        );
    });

    //teste de um caso
    it('Teste de exemplo - somar numeros e o resultado deve ser 3', () => {
        // Configurar - arange
        const numero1 = 1;
        const numero2 = 2;
        // Fazer alguma coisa - act
        const result = numero1 + numero2;
        // Conferir se essa ação foi esperada - assert
        expect(result).toBe(3);
    });

    it('pessoasService deve estar definido', () => {
        expect(pessoasService).toBeDefined();
    });

    describe('create', () => {
        it('deve criar uma nova pessoa', async () => {
            // Preciso de um objeto do tipo createPessoaDTO
            const roles: Role[] = [new Role('nomeRole', 'descricaoRole')];

            const createPessoaDto: CreatePessoaDto = {
                email: 'teste@TestAgent.com',
                password: '12345678',
                nome: 'Teste Create',
                roles,
            };

            // Preciso usar o método hash do do hashingService
            const passwordHash = 'HASH_SENHA';
            jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

            const novaPessoaMock = new Pessoa(
                'teste@TestAgent.com',
                passwordHash,
                'Teste Create',
                roles,
            );

            // Mock do método save para retornar a nova pessoa criada
            jest.spyOn(pessoaRepository, 'save').mockResolvedValue(
                novaPessoaMock,
            );

            // Act
            const result = await pessoasService.create(createPessoaDto);

            //Assert

            // Saber se o hashingService usou o tipo correto
            expect(hashingService.hash).toHaveBeenCalledWith(
                createPessoaDto.password,
            );

            // Saber se pessoaRepository.save foi chamado com a pessoa criada
            expect(pessoaRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...novaPessoaMock,
                }),
            );

            // O retorno final deve ser a nova pessoa criada -> expect

            expect(result).toEqual(novaPessoaMock);
        });

        it('deve gerar erro ao tentar criar um usuário', async () => {
            // Preciso usar o método hash do do hashingService
            const descricaoFalha = 'descricao';

            // Mock do método save para retornar exceção
            jest.spyOn(pessoaRepository, 'save').mockRejectedValue({
                detail: descricaoFalha,
            });

            //Assert

            await expect(pessoasService.create({} as any)).rejects.toThrow(
                new NotImplementedException('Erro: ' + descricaoFalha),
            );
        });
    });

    describe('find', () => {
        it('deve encontrar uma pessoa se passar id existente', async () => {
            const id = 1;
            const pessoaMock = {
                id,
                email: 'teste@email.com',
                passwordHash: 'hash',
                nome: 'nome',
            };

            // Mock do método findOne para retornar a pessoa encontrada
            jest.spyOn(pessoaRepository, 'findOne').mockResolvedValue(
                pessoaMock as any,
            );

            //ACT
            const result = await pessoasService.findOne(id);

            // assert

            expect(pessoaRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id },
                }),
            );

            expect(result).toEqual(pessoaMock);
        });

        it('deve encontrar uma pessoa se passar email existente', async () => {
            const email = 'teste@email';
            const pessoaMock = {
                id: 1,
                email,
                passwordHash: 'hash',
                nome: 'nome',
            };

            // Mock do método findOne para retornar a pessoa encontrada
            jest.spyOn(pessoaRepository, 'findOne').mockResolvedValue(
                pessoaMock as any,
            );

            //ACT
            const result = await pessoasService.findByEmail(email);

            // assert

            expect(pessoaRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { email },
                }),
            );

            expect(result).toEqual(pessoaMock);
        });

        it('deve retornar todas as pessoas do banco', async () => {
            const todasPessoas = [];

            jest.spyOn(pessoaRepository, 'find').mockResolvedValue(
                todasPessoas,
            );

            const result = await pessoasService.findAll();

            expect(result).toEqual(todasPessoas);
        });
    });

    describe('remove', () => {
        it('deve remover uma pessoa com sucesso quando o usuário é administrador', async () => {
            const id = 1;
            const tokenPayload: TokenPayloadDto = {} as any;
            const pessoaEncontrada = {} as any;

            //Simula
            jest.spyOn(pessoasService, 'findOne').mockResolvedValue(
                pessoaEncontrada,
            );
            jest.spyOn(UtilShared, 'usuarioEhAdmin').mockReturnValue(true);
            jest.spyOn(pessoaRepository, 'delete').mockResolvedValue(undefined);

            const result = await pessoasService.remove(id, tokenPayload);

            expect(pessoasService.findOne).toHaveBeenCalledWith(id);
            expect(UtilShared.usuarioEhAdmin).toHaveBeenCalledWith(
                tokenPayload,
            );
            expect(pessoaRepository.delete).toHaveBeenCalledWith(id);
            expect(result).toBe('Pessoa removida com sucesso');
        });

        it('deve lançar UnauthorizedException quando o usuário não é administrador', async () => {
            const id = 1;
            const tokenPayload: TokenPayloadDto = {} as any;
            const pessoaEncontrada = { id, nome: 'Teste Pessoa' };

            jest.spyOn(pessoasService, 'findOne').mockResolvedValue(
                pessoaEncontrada as any,
            );
            jest.spyOn(UtilShared, 'usuarioEhAdmin').mockReturnValue(false);

            await expect(
                pessoasService.remove(id, tokenPayload),
            ).rejects.toThrow(
                new UnauthorizedException(
                    'Usuário não possui permissão para realizar a ação.',
                ),
            );

            expect(pessoasService.findOne).toHaveBeenCalledWith(id);
            expect(UtilShared.usuarioEhAdmin).toHaveBeenCalledWith(
                tokenPayload,
            );
            expect(pessoaRepository.delete).not.toHaveBeenCalled();
        });

        it('deve retornar "Id inexistente" quando a pessoa não é encontrada', async () => {
            const id = 1;
            const tokenPayload: TokenPayloadDto = {} as any;

            jest.spyOn(pessoasService, 'findOne').mockResolvedValue(null);

            const result = await pessoasService.remove(id, tokenPayload);

            expect(pessoasService.findOne).toHaveBeenCalledWith(id);
            expect(result).toBe('Id inexistente');
            expect(pessoaRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('deve lançar NotFoundException quando a pessoa não for encontrada', async () => {
            const id = 1;
            const updatePessoaDto: UpdatePessoaDto = {
                nome: 'Novo Nome',
                password: 'novaSenha',
                roles: [],
            };
            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(null); // Simulando que a pessoa não foi encontrada

            await expect(
                pessoasService.update(id, updatePessoaDto, tokenPayload),
            ).rejects.toThrow(new NotFoundException('Pessoa não encontrada'));
        });

        it('deve lançar UnauthorizedException quando o usuário não tem permissão', async () => {
            const id = 1;
            const updatePessoaDto: UpdatePessoaDto = {
                nome: 'Novo Nome',
                password: 'novaSenha',
                roles: [],
            };
            const tokenPayload: TokenPayloadDto = { sub: '1' };

            // Simula uma pessoa encontrada, mas com permissões insuficientes
            const pessoaMock = {} as any;
            jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(
                pessoaMock,
            );
            jest.spyOn(UtilShared, 'tokenEhDoUsuario').mockReturnValue(false); // Simula que o token não é do usuário
            jest.spyOn(UtilShared, 'usuarioEhAdmin').mockReturnValue(false); // Simula que o usuário não é admin

            await expect(
                pessoasService.update(id, updatePessoaDto, tokenPayload),
            ).rejects.toThrow(
                new UnauthorizedException(
                    'Usuário não possui permissão para realizar a ação.',
                ),
            );
        });

        it('deve atualizar a pessoa com sucesso', async () => {
            const id = 1;
            const updatePessoaDto: UpdatePessoaDto = {
                nome: 'Novo Nome',
                password: 'novaSenha',
                roles: [],
            };
            const tokenPayload: TokenPayloadDto = { sub: '1' };

            const pessoaMock = {};
            const pessoaAtualizadaMock = {};

            jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(
                pessoaMock as any,
            );
            jest.spyOn(pessoaRepository, 'save').mockResolvedValue(
                pessoaAtualizadaMock as any,
            );
            jest.spyOn(UtilShared, 'tokenEhDoUsuario').mockReturnValue(true); // Simula que o token é do usuário

            const result = await pessoasService.update(
                id,
                updatePessoaDto,
                tokenPayload,
            );

            expect(result).toEqual({
                mensagem: `Pessoa id: #${id} atualizada com sucesso`,
                pessoaAtualizada: pessoaAtualizadaMock,
            });
        });
    });

    describe('uploadFotos no Banco', () => {
        it('deve salvar a foto no banco com sucesso', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = {
                sub: '1',
            };
            const pessoaMock: Pessoa = {} as any;
            pessoaMock.id = 1;
            pessoaMock.foto = null;
            pessoaMock.nomeFoto = null;

            jest.spyOn(pessoasService, 'ehFileValido').mockImplementation(
                () => {},
            );
            jest.spyOn(pessoasService, 'getFileExtention').mockReturnValue(
                'jpg',
            );
            jest.spyOn(pessoaRepository, 'findOne').mockResolvedValue(
                pessoaMock,
            );
            jest.spyOn(pessoaRepository, 'save').mockResolvedValue(pessoaMock);

            const result = await pessoasService.uploadFotoNoBanco(
                file,
                tokenPayload,
            );

            expect(pessoasService.ehFileValido).toHaveBeenCalledWith(file);
            expect(pessoasService.getFileExtention).toHaveBeenCalledWith(file);
            expect(pessoaRepository.findOne).toHaveBeenCalledWith({
                where: { id: Number(tokenPayload.sub) },
            });

            expect(pessoaRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    foto: file.buffer,
                    nomeFoto: `${tokenPayload.sub}.jpg`,
                }),
            );
            expect(result).toEqual({ mesagem: 'Foto salva com sucesso!' });
        });

        it('deve lançar BadRequestException quando o arquivo não é válido', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 30 * 1024, // arquivo muito pequeno
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoasService, 'ehFileValido').mockImplementation(
                () => {
                    throw new BadRequestException(
                        'Imagem inválida. Tamanho máximo: 1MB',
                    );
                },
            );

            await expect(
                pessoasService.uploadFotoNoBanco(file, tokenPayload as any),
            ).rejects.toThrow(BadRequestException);

            expect(pessoasService.ehFileValido).toHaveBeenCalledWith(file);
            expect(pessoaRepository.save).not.toHaveBeenCalled();
        });

        it('deve lançar BadRequestException quando a extensão do arquivo é inválida', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.exe',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoasService, 'getFileExtention').mockImplementation(
                () => {
                    throw new BadRequestException('Arquivo inválido');
                },
            );

            await expect(
                pessoasService.uploadFotoNoBanco(file, tokenPayload),
            ).rejects.toThrow(new BadRequestException('Arquivo inválido'));

            expect(pessoasService.getFileExtention).toHaveBeenCalledWith(file);
            expect(pessoaRepository.save).not.toHaveBeenCalled();
        });

        it('deve lidar com erros inesperados corretamente', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoaRepository, 'findOne').mockImplementation(() => {
                throw new Error('Erro inesperado');
            });

            await expect(
                pessoasService.uploadFotoNoBanco(file, tokenPayload),
            ).rejects.toThrow(Error('Erro inesperado'));

            expect(pessoaRepository.findOne).toHaveBeenCalledWith({
                where: { id: Number(tokenPayload.sub) },
            });
        });
    });

    describe('uploadFoto no FileSystem', () => {
        it('deve salvar a imagem no sistema de arquivos com sucesso', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
                fieldname: 'foto',
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };
            const mockDateNow = 1737482440269;
            jest.spyOn(global.Date, 'now').mockReturnValue(mockDateNow);

            const fileName = `${tokenPayload.sub}_${mockDateNow}.jpg`;
            const fileFullPath = path.resolve(
                process.cwd(),
                'pictures',
                fileName,
            );

            jest.spyOn(pessoasService, 'ehFileValido').mockImplementation(
                () => {},
            );
            jest.spyOn(pessoasService, 'getFileExtention').mockReturnValue(
                'jpg',
            );

            jest.spyOn(fs, 'writeFile').mockResolvedValue();

            const result = await pessoasService.uploadFotoFileSystem(
                file,
                tokenPayload,
            );

            expect(pessoasService.ehFileValido).toHaveBeenCalledWith(file);
            expect(pessoasService.getFileExtention).toHaveBeenCalledWith(file);
            expect(fs.writeFile).toHaveBeenCalledWith(
                fileFullPath,
                file.buffer,
            );
            expect(result).toEqual({
                mensagem: 'Imagem salva na pasta pictures com sucesso.',
                fieldname: file.fieldname,
                originalname: file.originalname,
            });
        });

        it('deve lançar BadRequestException quando o arquivo não é válido', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 10 * 1024, // arquivo muito pequeno
                fieldname: 'foto',
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoasService, 'ehFileValido').mockImplementation(
                () => {
                    throw new BadRequestException(
                        'Imagem inválida.Tamanho mínimo: 50Kb e  Tamanho máximo: 1MB',
                    );
                },
            );

            await expect(
                pessoasService.uploadFotoFileSystem(file, tokenPayload as any),
            ).rejects.toThrow(BadRequestException);

            expect(pessoasService.ehFileValido).toHaveBeenCalledWith(file);
        });

        it('deve lançar BadRequestException quando a extensão do arquivo é inválida', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.exe',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
                fieldname: 'foto',
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(pessoasService, 'getFileExtention').mockImplementation(
                () => {
                    throw new BadRequestException('Arquivo inválido');
                },
            );

            await expect(
                pessoasService.uploadFotoFileSystem(file, tokenPayload),
            ).rejects.toThrow(new BadRequestException('Arquivo inválido'));

            expect(pessoasService.getFileExtention).toHaveBeenCalledWith(file);
        });

        it('deve lidar com erros ao escrever o arquivo no sistema de arquivos', async () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 500000,
                fieldname: 'foto',
            } as Express.Multer.File;

            const tokenPayload: TokenPayloadDto = { sub: '1' };

            jest.spyOn(fs, 'writeFile').mockRejectedValue(
                new Error('Erro ao salvar o arquivo'),
            );

            await expect(
                pessoasService.uploadFotoFileSystem(file, tokenPayload),
            ).rejects.toThrow(new Error('Erro ao salvar o arquivo'));

            expect(fs.writeFile).toHaveBeenCalled();
        });
    });
    describe('ehFileValido', () => {
        it('deve lançar BadRequestException para arquivo menor que 50KB', () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 30 * 1024, // 30KB
                fieldname: 'foto',
            } as Express.Multer.File;

            expect(() => pessoasService.ehFileValido(file)).toThrow(
                new BadRequestException(
                    'Imagem inválida.Tamanho mínimo: 50Kb e  Tamanho máximo: 1MB',
                ),
            );
        });

        it('deve lançar BadRequestException para arquivo maior que 1MB', () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 2 * 1024 * 1024, // 2MB
                fieldname: 'foto',
            } as Express.Multer.File;

            expect(() => pessoasService.ehFileValido(file)).toThrowError(
                new BadRequestException(
                    'Imagem inválida.Tamanho mínimo: 50Kb e  Tamanho máximo: 1MB',
                ),
            );
        });

        it('não deve lançar exceção para arquivo válido', () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 100 * 1024, // 100KB
                fieldname: 'foto',
            } as Express.Multer.File;

            expect(() => pessoasService.ehFileValido(file)).not.toThrow();
        });
    });

    describe('getFileExtention', () => {
        it('deve retornar a extensão correta do arquivo', () => {
            const file: Express.Multer.File = {
                originalname: 'foto.jpg',
                buffer: Buffer.from('mock buffer'),
                size: 100 * 1024,
                fieldname: 'foto',
            } as Express.Multer.File;

            const ext = pessoasService.getFileExtention(file);
            expect(ext).toBe('jpg');
        });

        it('deve lançar BadRequestException para arquivo sem nome original', () => {
            const file: Express.Multer.File = {
                buffer: Buffer.from('mock buffer'),
                size: 100 * 1024,
                fieldname: 'foto',
            } as Express.Multer.File;

            expect(() => pessoasService.getFileExtention(file)).toThrow(
                new BadRequestException('Arquivo inválido'),
            );
        });

        it('deve lançar BadRequestException para nome de arquivo inválido', () => {
            const file: Express.Multer.File = {
                originalname: null,
                buffer: Buffer.from('mock buffer'),
                size: 100 * 1024,
                fieldname: 'foto',
            } as Express.Multer.File;

            expect(() => pessoasService.getFileExtention(file)).toThrow(
                new BadRequestException('Arquivo inválido'),
            );
        });
    });
});

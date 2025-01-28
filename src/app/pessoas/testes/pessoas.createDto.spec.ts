import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';

describe('CreatePessoaDto', () => {
    it('deve falhar quando email é inválido', async () => {
        const input = {
            email: 'invalid-email',
            password: 'password123',
            nome: 'Nome',
        };
        const dtoInstance = plainToInstance(CreatePessoaDto, input);
        const errors = await validate(dtoInstance as any);

        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('deve falhar quando password tem menos de 8 caracteres', async () => {
        const input = {
            email: 'test@example.com',
            password: 'short',
            nome: 'Nome',
        };
        const dtoInstance = plainToInstance(CreatePessoaDto, input);
        const errors = await validate(dtoInstance as any);

        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('deve passar com valores válidos', async () => {
        const input = {
            email: 'test@example.com',
            password: 'password123',
            nome: 'Nome',
        };
        const dtoInstance = plainToInstance(CreatePessoaDto, input);
        const errors = await validate(dtoInstance as any);

        expect(errors).toHaveLength(0);
    });
});

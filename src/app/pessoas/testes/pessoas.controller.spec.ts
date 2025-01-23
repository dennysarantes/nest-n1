import { PessoasController } from '../pessoas.controller';

describe('PessoasController', () => {
    let controller: PessoasController;
    const pessoasServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByEmail: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        uploadFotoNoBanco: jest.fn(),
        uploadFotoFileSystem: jest.fn(),
    };

    beforeEach(() => {
        controller = new PessoasController(pessoasServiceMock as any);
    });

    it('create - deve usar o PessoaService com o argumento correto', async () => {
        const argument = { key: 'value' };
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(pessoasServiceMock, 'create').mockResolvedValue(expected);

        const result = await controller.create(argument as any);

        expect(pessoasServiceMock.create).toHaveBeenCalledWith(argument);
        expect(result).toEqual(expected);
    });

    it('findAll - deve usar o PessoaService', async () => {
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(pessoasServiceMock, 'findAll').mockResolvedValue(expected);

        const result = await controller.findAll();

        expect(pessoasServiceMock.create).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });

    it('findOne - deve usar o PessoaService com o argumento correto', async () => {
        const argument = '1';
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(pessoasServiceMock, 'findOne').mockResolvedValue(expected);

        const result = await controller.findOne(argument as any);

        expect(pessoasServiceMock.findOne).toHaveBeenCalledWith(+argument);
        expect(result).toEqual(expected);
    });

    it('update - deve usar o PessoaService com os argumentos corretos', async () => {
        const argument1 = '1';
        const argument2 = { key: 'value' };
        const argument3 = { key: 'value' };
        const expected = {
            mensagem: `Pessoa id: #${argument1} atualizada com sucesso`,
            pessoaAtualizada: {} as any,
        };

        jest.spyOn(pessoasServiceMock, 'update').mockResolvedValue(expected);

        const result = await controller.update(
            argument2 as any,
            argument1 as any,
            argument3 as any,
        );

        expect(pessoasServiceMock.update).toHaveBeenCalledWith(
            +argument1,
            argument2,
            argument3,
        );

        expect(result).toEqual(expected);
    });

    it('remove - deve usar o PessoaService com os argumentos corretos', async () => {
        const argument1 = { aKey: 'aValue' };
        const argument2 = 1;
        const expected = {};

        jest.spyOn(pessoasServiceMock, 'remove').mockResolvedValue(expected);

        const result = await controller.remove(
            argument1 as any,
            argument2 as any,
        );

        expect(pessoasServiceMock.remove).toHaveBeenCalledWith(
            argument2,
            argument1,
        );

        expect(result).toEqual(expected);
    });

    it('upload-foto-banco - deve usar o PessoaService com os argumentos corretos', async () => {
        const argument1 = { aKey: 'aValue' };
        const argument2 = { bKey: 'bValue' };
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(pessoasServiceMock, 'uploadFotoNoBanco').mockResolvedValue(
            expected,
        );

        const result = await controller.uploadFotoBanco(
            argument1 as any,
            argument2 as any,
        );

        expect(pessoasServiceMock.uploadFotoNoBanco).toHaveBeenCalledWith(
            argument1,
            argument2,
        );
        expect(result).toEqual(expected);
    });

    it('upload-foto-file-system - deve usar o PessoaService com os argumentos corretos', async () => {
        const argument1 = { aKey: 'aValue' };
        const argument2 = { bKey: 'bValue' };
        const expected = { anyKey: 'anyValue' };

        jest.spyOn(
            pessoasServiceMock,
            'uploadFotoFileSystem',
        ).mockResolvedValue(expected);

        const result = await controller.uploadFotoFileSystem(
            argument1 as any,
            argument2 as any,
        );

        expect(pessoasServiceMock.uploadFotoFileSystem).toHaveBeenCalledWith(
            argument1,
            argument2,
        );
        expect(result).toEqual(expected);
    });
});

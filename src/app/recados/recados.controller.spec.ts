import { Test, TestingModule } from '@nestjs/testing';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';

describe('RecadosController', () => {
    let controller: RecadosController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecadosController],
            providers: [RecadosService],
        }).compile();

        controller = module.get<RecadosController>(RecadosController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UploadPicController } from './upload-pic.controller';
import { UploadPicService } from './upload-pic.service';

describe('UploadPicController', () => {
    let controller: UploadPicController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadPicController],
            providers: [UploadPicService],
        }).compile();

        controller = module.get<UploadPicController>(UploadPicController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

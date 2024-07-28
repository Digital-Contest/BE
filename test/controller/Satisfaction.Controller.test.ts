
import { Request, Response } from 'express';
import { ProductStatus } from '../../src/dto/request/ProductStatus';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import {SatisfactionService} from '../../src/service/Satisfaction.Service';
import {SatisfactionController} from '../../src/controller/Satisfaction.Controller';
import { Satisfaction } from '../../src/dto/response/Satisfaction';
import { SatisfactionDetail, SatisfactionDetailData } from '../../src/dto/response/SatisfactionDetail';


declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { user_id: number };
    }
}

jest.mock('../../src/service/Satisfaction.Service')

const mockSatisfactionService = new SatisfactionService({} as any) as jest.Mocked<SatisfactionService>;

const satisfactionController = new SatisfactionController(mockSatisfactionService);


describe('Satisfaction Controller test', ()=>{

    beforeEach(() => {
        jest.clearAllMocks();
      });
    

    describe('GET /satisfaction/platform/:kind', ()=>{

        it('bringPlatfromSatisfation 함수', async()=>{
            
            const req = { decoded: { user_id: 1 } }  as Request;
            const kind = 'mock-kind';
            const bringPlatfromSatisfationResponse = [
                Satisfaction.of('target1', 'category1', 10),
                Satisfaction.of('target2', 'category2', 20)
            ];

            mockSatisfactionService.bringPlatfromSatisfation.mockResolvedValue(bringPlatfromSatisfationResponse);

            const result = await satisfactionController.bringPlatfromSatisfation(req, kind);

            expect(result).toEqual(SuccessResponseDto.of(bringPlatfromSatisfationResponse));
            expect(mockSatisfactionService.bringPlatfromSatisfation).toHaveBeenCalledWith(req.decoded?.user_id, kind);
        });
    });


    describe('GET /satisfaction/category/:kind', ()=>{

        it('bringCategorySatisfation 함수', async()=>{
            
            const req = { decoded: { user_id: 1 } }  as Request;
            const kind = 'mock-kind';
            const bringCategorySatisfationResponse = [
                Satisfaction.of('target1', 'category1', 10),
                Satisfaction.of('target2', 'category2', 20)
            ];

            mockSatisfactionService.bringCategorySatisfation.mockResolvedValue(bringCategorySatisfationResponse);

            const result = await satisfactionController.bringCategorySatisfation(req, kind);

            expect(result).toEqual(SuccessResponseDto.of(bringCategorySatisfationResponse));
            expect(mockSatisfactionService.bringCategorySatisfation).toHaveBeenCalledWith(req.decoded?.user_id, kind);
        });
    });



    describe('GET /satisfaction/platform/detail/:kind', ()=>{

        it('bringPlatfromDetailSatisfation 함수', async()=>{
            
            const req = { decoded: { user_id: 1 } }  as Request;
            const kind = 'mock-kind';
            const mockSatisfactionDetailData = [ SatisfactionDetailData.of('mock-introduceTextCategory1', 2),  SatisfactionDetailData.of('mock-introduceTextCategory2', 4)]
            const bringPlatfromDetailSatisfationResponse = [
                SatisfactionDetail.of('target1', mockSatisfactionDetailData),
                SatisfactionDetail.of('target2', mockSatisfactionDetailData)
            ];

            mockSatisfactionService.bringPlatfromDetailSatisfation.mockResolvedValue(bringPlatfromDetailSatisfationResponse);

            const result = await satisfactionController.bringPlatfromDetailSatisfation(req, kind);

            expect(result).toEqual(SuccessResponseDto.of(bringPlatfromDetailSatisfationResponse));
            expect(mockSatisfactionService.bringPlatfromDetailSatisfation).toHaveBeenCalledWith(req.decoded?.user_id, kind);
        });
    });


    describe('GET /satisfaction/category/detail/:kind', ()=>{

        it('bringCategoryDetailSatisfation 함수', async()=>{
            
            const req = { decoded: { user_id: 1 } }  as Request;
            const kind = 'mock-kind';
            const mockSatisfactionDetailData = [ SatisfactionDetailData.of('mock-introduceTextCategory1', 2),  SatisfactionDetailData.of('mock-introduceTextCategory2', 4)]
            const bringCategoryDetailSatisfationResponse = [
                SatisfactionDetail.of('target1', mockSatisfactionDetailData),
                SatisfactionDetail.of('target2', mockSatisfactionDetailData)
            ];

            mockSatisfactionService.bringCategoryDetailSatisfation.mockResolvedValue(bringCategoryDetailSatisfationResponse);

            const result = await satisfactionController.bringCategoryDetailSatisfation(req, kind);

            expect(result).toEqual(SuccessResponseDto.of(bringCategoryDetailSatisfationResponse));
            expect(mockSatisfactionService.bringCategoryDetailSatisfation).toHaveBeenCalledWith(req.decoded?.user_id, kind);
        });
    });


 

});
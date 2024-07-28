
import { Request, Response } from 'express';
import { ProductStatus } from '../../src/dto/request/ProductStatus';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import {QuotationService} from '../../src/service/Quotation.Service';
import {QuotationController} from '../../src/controller/Quotation.Controller';


declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { user_id: number };
    }
}

jest.mock('../../src/service/Quotation.Service')

const mockQuotationService = new QuotationService( {} as any) as jest.Mocked<QuotationService>;

const quotationController = new QuotationController(mockQuotationService);


describe('Quotation Controller test', ()=>{

    beforeEach(() => {
        jest.clearAllMocks();
      });
    

    describe('GET /quotation', ()=>{

        it('bringPlatformQuotation 함수', async()=>{
            
            const item = 'mock-item';

            const bringPlatformQuotationResponse : any = [{},{},{}];

            mockQuotationService.bringPlatformQuotation.mockResolvedValue(bringPlatformQuotationResponse);

            const result = await quotationController.bringPlatformQuotation(item);

            expect(result).toEqual(SuccessResponseDto.of(bringPlatformQuotationResponse));
            expect(mockQuotationService.bringPlatformQuotation).toHaveBeenCalledWith(3, item);
        });
    });


 

});
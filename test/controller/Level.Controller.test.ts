import { SecondhandTradeCount } from '../../src/dto/response/SecondhandTradeCount';
import {LevelService} from '../../src/service/Level.Service'
import {LevelController} from '../../src/controller/Level.Conroller'
import { Request, Response } from 'express';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import { LevelInformation } from '../../src/dto/response/LevelInformation';
import { LevelColor } from '../../src/dto/response/LevelColor';

jest.mock('../../src/service/Level.Service')

declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { user_id: number };
    }
}


const mockLevelService = new LevelService(
    {} as any,
    {} as any
)as jest.Mocked<LevelService>;

const levelController = new LevelController(mockLevelService)


describe('Level Controller tset', ()=>{

    beforeEach(() => {
        jest.clearAllMocks();
      });
    

    describe('GET /level/secondhand-trade/count', ()=>{

        it('bringSecondhandTradeCount 함수', async()=>{

            const req = { decoded: { user_id: 1 } } as unknown as Request;
            const bringSecondhandTradeCountResponse = SecondhandTradeCount.of(20);
            mockLevelService.bringSecondhandTradeCount.mockResolvedValue(bringSecondhandTradeCountResponse)
            const result = await levelController.bringSecondhandTradeCount(req);
            expect(result).toEqual(SuccessResponseDto.of(bringSecondhandTradeCountResponse));
            expect(mockLevelService.bringSecondhandTradeCount).toHaveBeenCalledWith(req.decoded?.user_id);
        });
    });


    describe('GET /level/information', ()=>{

        it('bringLevelInformation 함수', async()=>{

            const req = { decoded: { user_id: 1 } } as unknown as Request;
            const bringLevelInformationResponse = LevelInformation.of(10, 2, 3);
            mockLevelService.bringLevelInformation.mockResolvedValue(bringLevelInformationResponse);
            const result = await levelController.bringLevelInformation(req);
            expect(result).toEqual(SuccessResponseDto.of(bringLevelInformationResponse));
            expect(mockLevelService.bringLevelInformation).toHaveBeenCalledWith(req.decoded?.user_id)

        });
    });



    describe('GET /level/color', ()=>{

        it('bringLevelColor 함수', async()=>{

            const req = { decoded: { user_id: 1 } } as unknown as Request;
            const bringLevelColorResponse = LevelColor.of('mock-color');
            mockLevelService.bringLevelColor.mockResolvedValue(bringLevelColorResponse);
            const result = await levelController.bringLevelColor(req);
            expect(result).toEqual(SuccessResponseDto.of(bringLevelColorResponse));
            expect(mockLevelService.bringLevelColor).toHaveBeenCalledWith(req.decoded?.user_id);
        });
    });






});
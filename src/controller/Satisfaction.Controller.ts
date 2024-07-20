
import { JsonController, HttpCode, Req,  UseBefore, Get, Param } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { UserNickname } from "../dto/response/UserNickname";
import { SatisfactionService } from "../service/Satisfaction.Service";
import { CompanySatisfaction } from "../dto/response/CompanySatisfaction";



@Service()
@JsonController('/satisfaction')
export class SatisfactionController {
    constructor(
        private satisfactionService: SatisfactionService) {}



    /**
     * 플랫폼 별 선호 말투 조회함수 -> 전체 or 나의 통계 선택
     * @param req 
     * @param kind 종류 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/:kind')
    async bringProductSatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<CompanySatisfaction[]>> {
        const result = await this.satisfactionService.bringProductSatisfation(req.decoded.user_id, kind);
        console.log("물품 통계 조회 완료");
        return SuccessResponseDto.of(result);
    }



}
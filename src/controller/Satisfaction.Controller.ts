
import { JsonController, HttpCode, Req,  UseBefore, Get, Param } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { UserNickname } from "../dto/response/UserNickname";
import { SatisfactionService } from "../service/Satisfaction.Service";
import { PlatformSatisfaction } from "../dto/response/PlatformSatisfaction";
import { CategorySatisfaction } from "../dto/response/CategorySatisfaction";



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
    @Get('/platform/:kind')
    async bringPlatfromSatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<PlatformSatisfaction[]>> {
        const result = await this.satisfactionService.bringPlatfromSatisfation(req.decoded.user_id, kind);
        console.log("플랫폼별 회사통계 조회 완료");
        return SuccessResponseDto.of(result);
    }



    /**
     * 카테고리별 선호 말투통계 -> 전체 or 나의 통계 선택
     * @param req 
     * @param kind 종류 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/category/:kind')
    async bringCategorySatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<CategorySatisfaction[]>> {
        const result = await this.satisfactionService.bringCategorySatisfation(req.decoded.user_id, kind);
        console.log("카테고리별 회사통계 조회 완료");
        return SuccessResponseDto.of(result);
    }



}
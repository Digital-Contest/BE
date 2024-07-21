
import { JsonController, HttpCode, Req,  UseBefore, Get, Param } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { UserNickname } from "../dto/response/UserNickname";
import { SatisfactionService } from "../service/Satisfaction.Service";
import { Satisfaction } from "../dto/response/Satisfaction";
import { CategorySatisfaction } from "../dto/response/CategorySatisfaction";
import { SatisfactionDetail } from "dto/response/SatisfactionDetail";



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
    async bringPlatfromSatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<Satisfaction[]>> {
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
    async bringCategorySatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<Satisfaction[]>> {
        const result = await this.satisfactionService.bringCategorySatisfation(req.decoded.user_id, kind);
        console.log("카테고리별 회사통계 조회 완료");
        return SuccessResponseDto.of(result);
    }


    /**
     * 플랫폼 별 선호 말투 상세 조회함수 -> 전체 or 나의 통계 선택
     * @param req 
     * @param kind 종류
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/platform/detail/:kind')
    async bringPlatfromDetailSatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<SatisfactionDetail[]>>{
        const result = await this.satisfactionService.bringPlatfromDetailSatisfation(req.decoded.user_id, kind);
        console.log("플랫폼별 회사통계 조회 완료");
        return SuccessResponseDto.of(result);
    }



    /**
     * 카테고리별 선호 말투 상세 조회함수 -> 전체 or 나의 통계 선택
     * @param req 
     * @param kind 종류
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/category/detail/:kind')
    async bringCategoryDetailSatisfation(@Req() req: Request, @Param('kind') kind:string): Promise<SuccessResponseDto<SatisfactionDetail[]>> {
        const result = await this.satisfactionService.bringCategoryDetailSatisfation(req.decoded.user_id, kind);
        console.log("카테고리별 회사통계 조회 완료");
        return SuccessResponseDto.of(result);
    }



}
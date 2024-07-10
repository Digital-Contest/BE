import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore, Get } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { LoginResponse } from "../dto/response/loginResponse.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { LevelService } from "../service/Level.Service.js";
import { SecondhandTradeCount } from "../dto/response/SecondhandTradeCount.js";
import { LevelInformation } from "../dto/response/LevelInformation.js";
import { LevelColor } from "../dto/response/LevelColor.js";



@Service()
@JsonController('/level')
export class LevelController {
    constructor(
        private readonly levelService:LevelService
    ) {}



/**
 * 내 중고 거래 횟수를 조회하는 함수
 * @param req 
 * @returns 중고거래 완료 물품 개수
 */
@HttpCode(200)
@UseBefore(compareAuthToken)
@Get('/secondhand-trade/count')
async bringSecondhandTradeCount(
    @Req() req: Request
): Promise<SuccessResponseDto<SecondhandTradeCount>>{
    const result = await this.levelService.bringSecondhandTradeCount(req.decoded.user_id);
    console.log("중고거래 완료 횟수 조회 완료"); 
    return SuccessResponseDto.of(result);
}


/**
 * 내 레벨 정보 조회 함수
 * @param req 
 * @returns 내 레벨 정보 
 */
@HttpCode(200)
@UseBefore(compareAuthToken)
@Get('/information')
async bringLevelInformation(
    @Req() req: Request
): Promise<SuccessResponseDto<LevelInformation>>{
    const result = await this.levelService.bringLevelInformation(req.decoded.user_id);
    console.log("레벨 정보 조회 완료"); 
    return SuccessResponseDto.of(result);
}


/**
 * 내 레벨 컬러 조회 함수
 * @param req 
 * @returns 레벨 컬러
 */
@HttpCode(200)
@UseBefore(compareAuthToken)
@Get('/color')
async bringLevelColor(
    @Req() req: Request
): Promise<SuccessResponseDto<LevelColor>>{
    const result = await this.levelService.bringLevelColor(req.decoded.user_id);
    console.log("레벨 컬러 조회 완료"); 
    return SuccessResponseDto.of(result);
}






}
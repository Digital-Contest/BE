import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore, Get } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { LoginResponse } from "../dto/response/loginResponse.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { LevelService } from "../service/Level.Service.js";
import { SecondhandTradeCount } from "../dto/response/SecondhandTradeCount.js";



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



}
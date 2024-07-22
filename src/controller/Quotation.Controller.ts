import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore, Get, QueryParam } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { LoginResponse } from "../dto/response/loginResponse";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { QuotationService } from "../service/Quotation.Service";



@Service()
@JsonController('/quotation')
export class QuotationController {
    constructor(private quotationService: QuotationService) {}

    @HttpCode(200)
    @Get()
    async bringPlatformQuotation(
        @QueryParam('item') item:string
    ) {
        console.log("start")
        await this.quotationService.bringPlatformQuotation(3, item)
        console.log("플랫폼별 시세 조회 완료");
        return SuccessResponseDto.of();
    
    }


}
import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore, Get, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
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
        const result = await this.quotationService.bringPlatformQuotation(3, item)
        console.log("플랫폼별 시세 조회 완료");
        return SuccessResponseDto.of(result);
    }


}
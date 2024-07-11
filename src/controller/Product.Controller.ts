


import { JsonController,  Body, HttpCode, Req, UseBefore, Get, Patch, Param, QueryParam } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { ProductStatus } from "../dto/request/ProductStatus.js";
import { ProductService } from "../service/Product.Service.js";
import { ProductList } from "../dto/response/ProductList.js";
import { Query } from "typeorm/driver/Query.js";



@Service()
@JsonController('/product')
export class ProductController {
    constructor(
        private readonly productService:ProductService
    ) {}

    /**
     * 물품 판매 상태 처리 함수
     * @param req 
     * @returns ..
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/status')
    async modifyProductStatus(
        @Req() req: Request,
        @Body() productStatus:ProductStatus
    ): Promise<SuccessResponseDto<void>>{
        await this.productService.modifyProductStatus(req.decoded.user_id, productStatus.getProductId(), productStatus.getStatus());
        console.log("물품 판매 처리 완료"); 
        return SuccessResponseDto.of();
    }

    /**
     * 상태에 따른 물품 조회 함수
     * @param req 
     * @param status 물품 상태 true -> 판매 완료, false -> 판매 실패, null -> 판매 중 
     * @returns 물품 정보
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get()
    async bringMyProduct(
        @Req() req: Request,
        @QueryParam('status') status: string
    ): Promise<SuccessResponseDto<ProductList[]>>{
        const result = await this.productService.bringMyProduct(req.decoded.user_id, status);
        console.log("물품 조회 완료"); 
        return SuccessResponseDto.of(result);
    }






}
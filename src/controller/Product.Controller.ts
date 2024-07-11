


import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore, Get, Patch } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { ProductStatus } from "../dto/request/ProductStatus.js";
import { ProductService } from "../service/Product.Service.js";



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



}
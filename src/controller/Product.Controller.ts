


import { JsonController,  Body, HttpCode, Req, UseBefore, Get, Patch, Param, QueryParam, Post } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { ProductStatus } from "../dto/request/ProductStatus";
import { ProductService } from "../service/Product.Service";
import { ProductList } from "../dto/response/ProductList";
import { ProductCreate } from "../dto/request/ProductCreat";
import { uploadImage } from "../middleware/s3Upload";



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


    @HttpCode(200)
    @UseBefore(compareAuthToken, uploadImage.array('files'))
    @Post()
    async pentrateProduct(
        @Req() req: any,
        @Body() productCreate: ProductCreate
    ): Promise<SuccessResponseDto<void>>{
        const imageUrls = req.files.map((image) => {return image.location});
        await this.productService.pentrateProduct(req.decoded.user_id, imageUrls, productCreate.getIntroduceCategory(), productCreate.getPrice(),
        productCreate.getProductCategory(), productCreate.getProduct(), productCreate.getIntroduceText(), productCreate.getCompanys());
        console.log("물품 등록 완료"); 
        return SuccessResponseDto.of();
    }






}
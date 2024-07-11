import { Body, HttpCode, JsonController, Post, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import {  IntroduceTextRequest } from "../dto/request/IntruduceTextRequest.js";
import { IntroduceService } from "../service/Introduce.Service.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { uploadImage } from "../util/s3Upload.js";
import { IntroduceTextResponse } from "../dto/response/IntroduceTextResponse.js";




@Service()
@JsonController('/introduce')
export class IntroduceController{



    constructor(
        private readonly introduceService:IntroduceService
    ){}


    /**
     * 유저 및 프롬프트를 통한 소개 글 생성 함수
     * @param introduceText 소개글 생성 시 요청 dto
     * @param req 
     * @returns 유저 및 프롬프트를 통한 소개 글
     */
    @Post('/text')
    @UseBefore(compareAuthToken, uploadImage.array('files'))
    @HttpCode(200)
    async makeIntroduceText(
        @Body() introduceText: IntroduceTextRequest,
        @Req() req: any
    ): Promise<SuccessResponseDto<IntroduceTextResponse>> {
        const imageUrls = req.files.map((image) => {return image.location})
        const result = await this.introduceService.makeIntroduceText(
            imageUrls, 
            introduceText.getIntroduceCategory(),
            introduceText.getPrice(), 
            introduceText.getProductCategory(),
            introduceText.getProduct()
        );
        console.log("소개글 생성 완료");
        return SuccessResponseDto.of(result); 
    }

}
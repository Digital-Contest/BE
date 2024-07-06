import { Body, HttpCode, JsonController, Post, Req } from "routing-controllers";
import { Service } from "typedi";
import { IntroduceText } from "../dto/request/IntruduceText.js";
import { IntroduceService } from "../service/Introduce.Service.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";

@Service()
@JsonController('/introduce')
export class IntroduceController{

    constructor(
        private readonly introduceService:IntroduceService
    ){}


    @Post('text')
    @HttpCode(200)
    async makeIntroduceText(@Body() introduceText: IntroduceText): Promise<SuccessResponseDto<string>> {
        const result = await this.introduceService.makeIntroduceText(
            introduceText.getImages(), 
            introduceText.getCategory(),
            introduceText.getPrice(), 
            introduceText.getProduct()
        );
        console.log("소개글 생성 완료");
        return SuccessResponseDto.of(result); 
    }

}
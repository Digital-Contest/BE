import { Body, HttpCode, JsonController, Post, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { IntroduceText } from "../dto/request/IntruduceText.js";
import { IntroduceService } from "../service/Introduce.Service.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });



@Service()
@JsonController('/introduce')
export class IntroduceController{



    constructor(
        private readonly introduceService:IntroduceService
    ){}

    @Post('/text')
    @UseBefore(compareAuthToken, upload.array('files'))
    @HttpCode(200)
    async makeIntroduceText(
        @Body() introduceText: IntroduceText,
        @Req() req: any
    ): Promise<SuccessResponseDto<string>> {
        const result = await this.introduceService.makeIntroduceText(
            req.files, 
            introduceText.getCategory(),
            introduceText.getPrice(), 
            introduceText.getProduct()
        );
        console.log("소개글 생성 완료");
        return SuccessResponseDto.of(result); 
    }

}
import { HttpCode, JsonController, Post, Req } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController('/introduce')
export class IntroduceController{


    @HttpCode(200)
@   Post('text')
    async makeIntroduceText(@Req() req: Request) {

       
   
    }

}
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { checkData } from "../util/checker.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { ErrorCode } from "../exception/ErrorCode.js";
import { getIntroduceTextCategoryByCondition } from "../util/enum/IntroduceTextCategory.js";
import { openAI } from "../util/openAI.js";
import { getProductCategoryByCondition } from "../util/enum/ProductCategory.js";
import {  IntroduceTextResponse } from "../dto/response/IntroduceTextResponse.js";

@Service()
export class IntroduceService{


    constructor(

    ) {}


    public async makeIntroduceText(images: string[], introduceCategory:string, price:number, productCategory:string, product:string): Promise<IntroduceTextResponse> {
        this.verifyIntroduceTextCategory(getIntroduceTextCategoryByCondition(introduceCategory));
        this.verifyProductCategory(getProductCategoryByCondition(productCategory));
        const introduceText = await openAI(images[0], price +product +getIntroduceTextCategoryByCondition(introduceCategory))
        return IntroduceTextResponse.of(introduceText);
    }




    private verifyIntroduceTextCategory(introduceTextCategoryData: string){
        if(!checkData(introduceTextCategoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY);
        }
    }


    private verifyProductCategory(productCategoryData: number){
        if(!checkData(productCategoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY);
        }
    }


}
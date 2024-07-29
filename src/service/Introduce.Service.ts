import { Service } from "typedi";
import { getIntroduceTextCategoryByCondition } from "../util/enum/IntroduceTextCategory";
import { openAI } from "../util/openAI";
import { getProductCategoryByCondition } from "../util/enum/ProductCategory";
import {  IntroduceTextResponse } from "../dto/response/IntroduceTextResponse";
import { verifyIntroduceTextCategory, verifyProductCategory } from "../util/verify";
import { checkData } from "../util/checker";

@Service()
export class IntroduceService{


    constructor(

    ) {}

    /**
     * chat gpt를 활용한 소개 글 생성 함수
     * @param images 객체 이미지 url
     * @param introduceCategory 소개 카테고리
     * @param price 가격
     * @param productCategory 물품 카테고리 
     * @param product 물품
     * @returns 소개 글
     */
    public async makeIntroduceText(images: string[], introduceCategory:string, price:number, productCategory:string, product:string): Promise<IntroduceTextResponse> {
        verifyIntroduceTextCategory(getIntroduceTextCategoryByCondition(introduceCategory));
        verifyProductCategory(getProductCategoryByCondition(productCategory));
        const introduceText = await openAI(images[0], this.checkPrice(price) +product +getIntroduceTextCategoryByCondition(introduceCategory))
        return IntroduceTextResponse.of(introduceText, this.checkPrice(price));
    }


    public checkPrice(price:number | undefined | null){
        let result = price;
        if(!checkData(price)){
            result = 50000
        }
        return result;
    }



}
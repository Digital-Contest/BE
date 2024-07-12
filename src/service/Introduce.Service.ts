import { Service } from "typedi";
import { getIntroduceTextCategoryByCondition } from "../util/enum/IntroduceTextCategory.js";
import { openAI } from "../util/openAI.js";
import { getProductCategoryByCondition } from "../util/enum/ProductCategory.js";
import {  IntroduceTextResponse } from "../dto/response/IntroduceTextResponse.js";
import { verifyIntroduceTextCategory, verifyProductCategory } from "../util/verify.js";

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
        const introduceText = await openAI(images[0], price +product +getIntroduceTextCategoryByCondition(introduceCategory))
        return IntroduceTextResponse.of(introduceText);
    }






}
import { ErrorCode } from "../exception/ErrorCode";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { checkData } from "./checker";

export const verifyIntroduceTextCategory = (introduceTextCategoryData: string) =>{
    if(!checkData(introduceTextCategoryData)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY);
    }
}


export const verifyProductCategory = (productCategoryData: number) => {
    if(!checkData(productCategoryData)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY);
    }
}
import { Product } from "entity/Product";
import { ErrorCode } from "../exception/ErrorCode";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { checkData } from "./checker";

export const verifyIntroduceTextCategory = (introduceTextCategoryData: string | undefined | null) =>{
    if(!checkData(introduceTextCategoryData)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY);
    }
}


export const verifyProductCategory = (productCategoryData: number | undefined | null) => {
    if(!checkData(productCategoryData)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY);
    }
}

/**
 * product의 데이터 유무에 따라 예외처리 함수
 * @param productData product 엔티티 데이터
 */
export const verfiyProduct = (productData:Product | undefined | null) => {
    if (!checkData(productData)) {
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT);
    }
}



export const signVerifyAccessToken = (status: boolean) => {
    if(status)
        throw ErrorResponseDto.of(ErrorCode.NOT_EXPIRED);
}

export const signVerifyRefreshToken = (status: boolean) => {
    if(!status)
        throw  ErrorResponseDto.of(ErrorCode.LOGIN_AGAIN);        
}
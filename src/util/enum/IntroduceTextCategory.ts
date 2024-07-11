
export enum IntroduceTextCategory{
    궁서체 = "위 이미지를 중고로 팔려고하는데 위에 제공한 가격과 상품을 토대로 궁서체로 판매글을 적어줘. 깔끔하고 센스있게 텍스트로 뽑아줘.",
    
}


export const getAllIntroduceTextCategory = () => {
    return Object.keys(IntroduceTextCategory);
}


export const getIntroduceTextCategoryByCondition = (key: string): string => {
    return IntroduceTextCategory[key as keyof typeof IntroduceTextCategory];
}
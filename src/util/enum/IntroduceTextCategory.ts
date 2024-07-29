
export enum IntroduceTextCategory{
    궁서체 = "위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 토대로 진지하고, 정중한 말투로 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘.",
    둥글둥글체= "위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 토대로 부드럽고, 호화로운 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘.",
    단호박체="위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 냉정하고, 진지한 말투로 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘.",
    성냥팔이체="위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 토대로 불쌍하고, 부탁하는 말투로 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘.",
    귀욤체="위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 토대로 상냥하고, 귀여운 말투로 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘.",
    요점만체="위 이미지를 중고로 팔거야. 앞에 제공한 가격과 상품명을 요점 위주의 말투로 판매글을 적어줘. 가격, 상품명, 설명글 형식으로 만들어줘."
}


export const getAllIntroduceTextCategory = () => {
    return Object.keys(IntroduceTextCategory).filter(key => isNaN(Number(key)));
}


export const getIntroduceTextCategoryByCondition = (key: string): string | null | undefined => {
    return IntroduceTextCategory[key as keyof typeof IntroduceTextCategory];
}



export enum ProductCategory{
    "기타중고"=1,
    "도서"=3,
    "식물"=5,
    "티켓/교환권"=5,
    "뷰티/미용"=8,
    "여성패션/잡화"=8,
    "남성패션/잡화"=8,
    "취미/게임/음반"=8,
    "반려동물용품"=10,
    "가공식품"=10,
    "생활주방"=12,
    "스포츠/레저"=12,
    "생활가전"=15,
    "디지털기기"=15,
    "건강기능식품"=15
}


export const getAllProductCategory = () => {
    return Object.keys(ProductCategory);
}


export const getProductCategoryByCondition = (key: string): number => {
    return ProductCategory[key as keyof typeof ProductCategory];
}
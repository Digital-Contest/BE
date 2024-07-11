
export enum IntroduceTextCategory{
    궁서체 = "ㄴ아렁니ㅏㅓㄹㄴㅇㄹ",
    
}


export const getAllIntroduceTextCategory = () => {
    return Object.keys(IntroduceTextCategory);
}


export const getIntroduceTextCategoryByCondition = (key: string): string => {
    return IntroduceTextCategory[key as keyof typeof IntroduceTextCategory];
}
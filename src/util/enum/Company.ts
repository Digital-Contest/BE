
export enum Company{
    당근=0,
    번개장터=1,
    중고나라=2,
    장마당=3

  
}

export const getAllCompany = () => {
    return Object.keys(Company).filter(key => isNaN(Number(key)));
}


export const getCompanyByCondition = (key: string): number => {
    return Company[key as keyof typeof Company];
}
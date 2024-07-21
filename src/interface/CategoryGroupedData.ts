import { CategoryDetailData } from "../dto/response/CategoryDetail";


export interface CategoryGroupedData {
    [key: string]: {
        category: string; 
        data: CategoryDetailData[];
    };
}
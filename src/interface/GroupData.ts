import { SatisfactionDetail, SatisfactionDetailData } from "../dto/response/SatisfactionDetail";

export interface GroupedData {
    [key: string]: {
        target: string; 
        data: SatisfactionDetailData[]
    };
}
import { PlatformDetailData } from "../dto/response/SatisfactionDetail";

export interface PlatformGroupedData {
    [key: string]: {
        company: string; 
        data: PlatformDetailData[];
    };
}
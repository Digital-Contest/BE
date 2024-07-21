import { PlatformDetailData } from "../dto/response/PlatformDetail";

export interface GroupedData {
    [key: string]: {
        company: string; 
        data: PlatformDetailData[];
    };
}
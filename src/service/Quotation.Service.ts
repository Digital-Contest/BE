import { Service } from 'typedi';
import { Crawler } from '../util/logic/Crawler';


@Service()
export class QuotationService {

    constructor(private readonly crawler:Crawler) {}


    public async bringPlatformQuotation(count:number, search:string){
        const crawlerResult = await this.crawler.bringCompanyProductPrice(count, search)
     //   const combinedResults = carrotCrawlingResult.concat(sunderCrawlingResult, usedCrawlingResult);
        return crawlerResult;
    }

   




}

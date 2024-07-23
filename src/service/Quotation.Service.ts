import { Service } from 'typedi';
import { Crawler } from '../util/logic/Crawler';


@Service()
export class QuotationService {

    constructor(private readonly crawler:Crawler) {}


    public async bringPlatformQuotation(count:number, search:string){
        const [carrotCrawlingResult, sunderCrawlingResult, usedCrawlingResult] = await Promise.all([
            this.crawler.carrotMarketCrawler(count, search),
            this.crawler.sunderMarket(count, search),
            this.crawler.usedCountry(count, search)
        ]);
        const combinedResults = carrotCrawlingResult.concat(sunderCrawlingResult, usedCrawlingResult);
        return combinedResults;
    }

   




}

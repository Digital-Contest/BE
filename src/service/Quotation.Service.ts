import { Service } from 'typedi';

import { AxiosResponse } from 'axios';
import { checkData } from '../util/checker';
import  puppeteer  from 'puppeteer'



@Service()
export class QuotationService {

    constructor() {}


    public async bringPlatformQuotation(count:number, search:string){
        const carrotCrawlingResult = await this.carrotMarketCrawler(count, search);
        console.log(carrotCrawlingResult)

    }

    public async carrotMarketCrawler(count:number, searchWord:string){
            const browser = await puppeteer.launch({ headless:true});
            const page = await browser.newPage();
            await page.goto(`https://www.daangn.com/search/${searchWord}/`);
            const crawlingResult = await page.evaluate((count) => {
                const result = [];
                for(let i = 3; i <= count+2; i++){
                    const data:any = {}
                    const imageElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                    const titleElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                    const priceElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link .article-info p.article-price`) as HTMLElement;
                    data.company = "당근마켓"
                    data.image = imageElement.src;
                    data.title = titleElement.alt;
                    data.price = priceElement.textContent.trim().replace(/[^0-9원]/g, '');
                    result.push(data);    
                }
                return result;
            }, count);
            await page.close();
            await browser.close();
            return crawlingResult;
    }


  




}

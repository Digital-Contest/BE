import  puppeteer, { Page }  from 'puppeteer'
import { Service } from 'typedi';

@Service()
export class Crawler{

    public async bringCompanyProductPrice(count: number, searchWord: string){
        console.log(0)
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log(1)
        const page = await browser.newPage();
        console.log(2)
        const carrotCrawlingResult = await this.carrotMarketCrawler(page, count, searchWord);
        const sunderCrawlingResult = await this.sunderMarket(page, count, searchWord);
        const usedCrawlingResult = await this.usedCountry(page, count, searchWord);
        console.log(3)
        await page.close();
        await browser.close();

        return carrotCrawlingResult.concat(sunderCrawlingResult, usedCrawlingResult);
    }

    public async carrotMarketCrawler(page:Page, count:number, searchWord:string) {
        try {
            // console.log(0)
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']
            // });
            // console.log(1)
            // const page = await browser.newPage();
            // console.log(2)
            await page.goto(`https://www.daangn.com/search/${searchWord}/`,{  timeout: 0 });
           // console.log(3)
            const crawlingResult = await page.evaluate((count) => {
                const result = [];
                for (let i = 3; i <= count + 3; i++) {
                    const data: any = {};
                    const imageElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                    const titleElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                    const priceElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link .article-info p.article-price`) as HTMLElement;
                    data.company = "당근마켓";
                    data.image = imageElement.src;
                    data.title = titleElement.alt;
                    data.price = priceElement.textContent.trim().replace(/[^0-9원]/g, '');
                    result.push(data);
                }
                return result;
            }, count);
        //    console.log(4)
            // await page.close();
            // await browser.close();
            return crawlingResult;
        } catch (error) {
            console.error('Error launching browser:', error);
            throw error;
        }    
    }

    public async sunderMarket(page:Page, count:number, searchWord:string){
        try {
            // const browser = await puppeteer.launch({    
            //     headless: true,
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']});
            // const page = await browser.newPage();
            await page.goto(`https://m.bunjang.co.kr/search/products?q=${searchWord}`);
            const searchResult = await page.evaluate((count) => {
                const result = [];
                for (let i = 1; i <= count + 1; i++) {
                    const data:any = {};
                    const searchImageElement = document.querySelector(`.sc-kcDeIU.WTgwo:nth-child(${i}) img`) as HTMLImageElement;
                    const searchTitleElement = document.querySelector(`.sc-kcDeIU.WTgwo:nth-child(${i}) div.sc-RcBXQ.kWzERy`) as HTMLImageElement;
                    const searchPriceElement = document.querySelector(`.sc-kcDeIU.WTgwo:nth-child(${i}) .sc-iSDuPN.cPlkrx`) as HTMLImageElement;
                    data.company = "번개장터";
                    data.image = searchImageElement ? searchImageElement.src : null;
                    data.title = searchTitleElement ? searchTitleElement.textContent : null;
                    data.price = searchPriceElement ? searchPriceElement.textContent : null;
                    result.push(data);
                }
                return result;
            }, count);
            // await page.close();
            // await browser.close();
            return searchResult
        } catch (e) {
            console.log(e);
        }
    }

    public async usedCountry(page:Page, count:number, searchWord:string){
        try {
            // const browser = await puppeteer.launch({  
            //     headless: true,
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']});
            // const page = await browser.newPage();
            await page.goto(`https://web.joongna.com/search/${searchWord}`);
            const searchResult = await page.evaluate((count) => {
                const result = [];
                for (let i = 1; i <= count; i++) {
                    const data:any= {};
                    const searchImageElement = document.querySelector(`.search-results li:nth-child(${i}) img`) as HTMLImageElement;
                    const searchTitleElement = document.querySelector(`.search-results li:nth-child(${i}) img`) as HTMLImageElement;
                    const searchPriceElement = document.querySelector(`.search-results li:nth-child(${i}) .w-full .font-semibold`) as HTMLImageElement;
                    data.company = "중고나라";
                    data.image = searchImageElement ? searchImageElement.src : null;
                    data.title = searchTitleElement ? searchTitleElement.textContent : null;
                    data.price = searchPriceElement ? searchPriceElement.textContent : null;
                    result.push(data);
                }
                return result;
            }, count);
            // await page.close();
            // await browser.close();
            return searchResult;
        } catch (e) {
            console.log(e);
        }
    }


  
}
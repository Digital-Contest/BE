import { Page } from "puppeteer";
import { Service } from "typedi";


@Service()
export class SunderMarketCrawler {
    public async crawl(page: Page, count: number, searchWord: string) {
        try {
            await page.goto(`https://m.bunjang.co.kr/search/products?q=${searchWord}`, { timeout: 0 });
            const crawlingResult = await this.evaluatePage(page, count);
            return crawlingResult;
        } catch (error) {
            console.error('Error launching browser:', error);
            throw error;
        }
    }

    private async evaluatePage(page: Page, count: number) {
        /* istanbul ignore next */
        return await page.evaluate((count) => {
            const result = [];
            for (let i = 1; i <= count + 1; i++) {
                const data: any = {};
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
    }



}
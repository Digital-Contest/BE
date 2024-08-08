import puppeteer, { Page } from 'puppeteer';
import { Service } from 'typedi';

@Service()
export class CarrotMarketCrawler {
    public async crawl(page: Page, count: number, searchWord: string) {
        try {
            await page.goto(`https://www.daangn.com/search/${searchWord}/`, { timeout: 0 });
            const crawlingResult = await this.evaluatePage(page, count);
            return crawlingResult;
        } catch (error) {
            console.error('Error launching browser:', error);
            throw error;
        }
    }

    private async evaluatePage(page: Page, count: number) {
        /* istanbul ignore next */
        return page.evaluate((count) => {
            const result = [];
            for (let i = 3; i < count + 3; i++) {
                const data: any = {};
                const imageElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                const titleElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link img`) as HTMLImageElement;
                const priceElement = document.querySelector(`#flea-market-wrap > article:nth-child(${i}) a.flea-market-article-link .article-info p.article-price`) as HTMLElement;
                data.company = "당근마켓";
                data.image = imageElement ? imageElement.src : '';
                data.title = titleElement ? titleElement.alt : '';
                data.price = priceElement ? priceElement.textContent.trim().replace(/[^0-9원]/g, '') : '';
                result.push(data);
            }
            return result;
        }, count);
    }
}

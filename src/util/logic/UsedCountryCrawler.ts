import { Page } from "puppeteer";

export class UsedCountryCrawler {
    public async crawl(page: Page, count: number, searchWord: string) {
        try {
            await page.goto(`https://web.joongna.com/search/${searchWord}`, { timeout: 0 });
            const searchResult = await page.evaluate((count) => {
                const result = [];
                for (let i = 1; i <= count; i++) {
                    const data: any = {};
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
            return searchResult;
        } catch (error) {
            console.error('Error launching browser:', error);
            throw error;
        }
    }
}
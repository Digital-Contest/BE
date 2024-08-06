import  puppeteer, { Page }  from 'puppeteer'
import { Service } from 'typedi';
import {CarrotMarketCrawler} from './CarrotMarketCrawler'
import { SunderMarketCrawler} from './SunderMarketCraler'
import {UsedCountryCrawler} from './UsedCountryCrawler'

@Service()
export class Crawler{
    constructor(
        private readonly carrotMarketCrawler: CarrotMarketCrawler,
        private readonly sunderMarketCrawler: SunderMarketCrawler,
        private readonly usedCountryCrawler: UsedCountryCrawler
    ) {}

    public async bringCompanyProductPrice(count: number, searchWord: string) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const carrotCrawlingResult = await this.carrotMarketCrawler.crawl(page, count, searchWord);
        const sunderCrawlingResult = await this.sunderMarketCrawler.crawl(page, count, searchWord);
        const usedCrawlingResult = await this.usedCountryCrawler.crawl(page, count, searchWord);
        await page.close();
        await browser.close();
        return carrotCrawlingResult.concat(sunderCrawlingResult, usedCrawlingResult);
    }


}
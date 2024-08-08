import puppeteer, { Page } from 'puppeteer';
import { SunderMarketCrawler } from '../../../src/util/logic/SunderMarketCrawler';  
import { mock } from 'jest-mock-extended';

describe('SunderMarketCrawler', () => {
    let crawler: SunderMarketCrawler;
    let page: Page;

    beforeEach(() => {
        crawler = new SunderMarketCrawler();
        page = mock<Page>();
    });

    describe('crawl 함수 테스트', () => {
        const data = [
            {
                company: "번개장터",
                image: "http://example.com/image1.jpg",
                title: "Title 1",
                price: "10000"
            },
            {
                company: "번개장터",
                image: "http://example.com/image2.jpg",
                title: "Title 2",
                price: "20000"
            }
        ]
        it('crawl 정상 테스트', async () => {
            (page.goto as jest.Mock).mockResolvedValue(undefined);
            (crawler as any).evaluatePage = jest.fn().mockResolvedValue(data);
            const searchWord = "test";
            const count = 2;
            const result = await crawler.crawl(page, count, searchWord);
            expect(result).toEqual(data);
            expect(page.goto).toHaveBeenCalledWith(`https://m.bunjang.co.kr/search/products?q=${searchWord}`, { timeout: 0 });
        });

        it('crawl page.goto 에러 ', async () => {
            (page.goto as jest.Mock).mockRejectedValue(new Error('Navigation failed'));
            const searchWord = "test";
            const count = 2;
            await expect(crawler.crawl(page, count, searchWord)).rejects.toThrow('Navigation failed');
            expect(page.goto).toHaveBeenCalledWith(`https://m.bunjang.co.kr/search/products?q=${searchWord}`, { timeout: 0 });
        });
    });

    describe('evaluatePage 함수 테스트', () => {
        const data = [
            {
                company: "번개장터",
                image: "http://example.com/image1.jpg",
                title: "Title 1",
                price: "10000"
            },
            {
                company: "번개장터",
                image: "http://example.com/image2.jpg",
                title: "Title 2",
                price: "20000"
            }
        ]
        it('evaluatePage 정상 테스트', async () => {
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                return data;});
            const count = 2;
            const result = await (crawler as any).evaluatePage(page, count);
            expect(result).toEqual(data);
        });

        it('evaluatePage 빈 값 반환 테스트', async () => {
            const data = [{
                    company: "번개장터",
                    image: "",
                    title: "",
                    price: ""
                }];
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                return data;
            });
            const count = 1;
            const result = await (crawler as any).evaluatePage(page, count);
            expect(result).toEqual(data);
        });

        it('evaluatePage page.evaluate 에러', async () => {
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                throw new Error('Evaluate failed');
            });
            const count = 2;
            await expect((crawler as any).evaluatePage(page, count)).rejects.toThrow('Evaluate failed');
        });
    });
});



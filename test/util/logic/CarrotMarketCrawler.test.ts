import puppeteer, { Page } from 'puppeteer';
import { CarrotMarketCrawler } from '../../../src/util/logic/CarrotMarketCrawler';  // Adjust the import path as necessary
;
import { mock } from 'jest-mock-extended';

describe('CarrotMarketCrawler', () => {
    let crawler: CarrotMarketCrawler;
    let page: Page;

    beforeEach(() => {
        crawler = new CarrotMarketCrawler();
        page = mock<Page>();
    });

    describe('crawl', () => {
        it('should navigate to the correct URL and return evaluated results', async () => {
            // Mocking page.goto to resolve immediately
            (page.goto as jest.Mock).mockResolvedValue(undefined);

            // Mocking evaluatePage to return specific data
            (crawler as any).evaluatePage = jest.fn().mockResolvedValue([
                {
                    company: "당근마켓",
                    image: "http://example.com/image1.jpg",
                    title: "Title 1",
                    price: "10000"
                },
                {
                    company: "당근마켓",
                    image: "http://example.com/image2.jpg",
                    title: "Title 2",
                    price: "20000"
                }
            ]);

            const searchWord = "test";
            const count = 2;

            const result = await crawler.crawl(page, count, searchWord);

            expect(result).toEqual([
                {
                    company: "당근마켓",
                    image: "http://example.com/image1.jpg",
                    title: "Title 1",
                    price: "10000"
                },
                {
                    company: "당근마켓",
                    image: "http://example.com/image2.jpg",
                    title: "Title 2",
                    price: "20000"
                }
            ]);

            // Verify that page.goto was called with the correct URL
            expect(page.goto).toHaveBeenCalledWith(`https://www.daangn.com/search/${searchWord}/`, { timeout: 0 });
        });

        it('should handle errors thrown by page.goto', async () => {
            // Mocking page.goto to throw an error
            (page.goto as jest.Mock).mockRejectedValue(new Error('Navigation failed'));

            const searchWord = "test";
            const count = 2;

            await expect(crawler.crawl(page, count, searchWord)).rejects.toThrow('Navigation failed');

            // Verify that page.goto was called with the correct URL
            expect(page.goto).toHaveBeenCalledWith(`https://www.daangn.com/search/${searchWord}/`, { timeout: 0 });
        });
    });

    describe('evaluatePage', () => {
        it('should process and return correct data from page.evaluate', async () => {
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                return [
                    {
                        company: "당근마켓",
                        image: "http://example.com/image1.jpg",
                        title: "Title 1",
                        price: "10000"
                    },
                    {
                        company: "당근마켓",
                        image: "http://example.com/image2.jpg",
                        title: "Title 2",
                        price: "20000"
                    }
                ];
            });
            const count = 2;
            const result = await (crawler as any).evaluatePage(page, count);
            expect(result).toEqual([
                {
                    company: "당근마켓",
                    image: "http://example.com/image1.jpg",
                    title: "Title 1",
                    price: "10000"
                },
                {
                    company: "당근마켓",
                    image: "http://example.com/image2.jpg",
                    title: "Title 2",
                    price: "20000"
                }
            ]);
        });

        it('should handle empty results', async () => {
            // Mocking page.evaluate to return an empty array
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                return [];
            });
            const count = 2;
            const result = await (crawler as any).evaluatePage(page, count);
            expect(result).toEqual([]);
        });


        
        it('should handle missing elements gracefully', async () => {
            // Mocking page.evaluate to return data with missing elements
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                return [
                    {
                        company: "당근마켓",
                        image: "",
                        title: "",
                        price: ""
                    }
                ];
            });

            const count = 1;

            const result = await (crawler as any).evaluatePage(page, count);

            expect(result).toEqual([
                {
                    company: "당근마켓",
                    image: "",
                    title: "",
                    price: ""
                }
            ]);
        });

        it('should handle errors within page.evaluate', async () => {
            // Mocking page.evaluate to throw an error
            (page.evaluate as jest.Mock).mockImplementation(async (fn: Function, count: number) => {
                throw new Error('Evaluate failed');
            });

            const count = 2;

            await expect((crawler as any).evaluatePage(page, count)).rejects.toThrow('Evaluate failed');
        });
    });
});
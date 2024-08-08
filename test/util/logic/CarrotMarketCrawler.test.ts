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




// import 'reflect-metadata';
// import puppeteer, { Page, Browser } from 'puppeteer';
// import { Container } from 'typedi';
// import { CarrotMarketCrawler } from '../../../src/util/logic/CarrotMarketCrawler';

// describe('CarrotMarketCrawler', () => {
//     let browser: Browser;
//     let page: Page;
//     let crawler: CarrotMarketCrawler;

//     beforeAll(async () => {
//         browser = await puppeteer.launch({ headless: true });
//         page = await browser.newPage();
//         crawler = Container.get(CarrotMarketCrawler);
//     });

//     afterAll(async () => {
//         await browser.close();
//     });

//     it('should crawl the page and return correct data', async () => {
//         const mockEvaluatePage = jest.spyOn<any, any>(crawler, 'evaluatePage').mockImplementation(async () => {
//             return [
//                 {
//                     company: '당근마켓',
//                     image: 'https://example.com/image.jpg',
//                     title: 'Example Item',
//                     price: '10000원',
//                 },
//             ];
//         });

//         const result = await crawler.crawl(page, 1, 'example-search-word');
//         expect(result).toEqual([
//             {
//                 company: '당근마켓',
//                 image: 'https://example.com/image.jpg',
//                 title: 'Example Item',
//                 price: '10000원',
//             },
//         ]);

//         expect(mockEvaluatePage).toHaveBeenCalledTimes(1);
//         mockEvaluatePage.mockRestore();
//     });

//     it('should throw an error if the page fails to load', async () => {
//         jest.spyOn(page, 'goto').mockImplementationOnce(async () => {
//             throw new Error('Failed to load page');
//         });

//         await expect(crawler.crawl(page, 1, 'example-search-word')).rejects.toThrow('Failed to load page');
//     });

//     it('should evaluate the page and return an empty array if no elements are found', async () => {
//         const result = await crawler['evaluatePage'](page, 0);
//         expect(result).toEqual([]);
//     });

//     it('should evaluate the page and return correct data', async () => {
//         const mockPageEvaluate = jest.spyOn(page, 'evaluate').mockImplementationOnce(async () => {
//             return [
//                 {
//                     company: '당근마켓',
//                     image: 'https://example.com/image.jpg',
//                     title: 'Example Item',
//                     price: '10000원',
//                 },
//             ];
//         });

//         const result = await crawler['evaluatePage'](page, 1);
//         expect(result).toEqual([
//             {
//                 company: '당근마켓',
//                 image: 'https://example.com/image.jpg',
//                 title: 'Example Item',
//                 price: '10000원',
//             },
//         ]);

//         expect(mockPageEvaluate).toHaveBeenCalledTimes(1);
//         mockPageEvaluate.mockRestore();
//     });

//     it('should handle cases where elements are missing on the page', async () => {
//         jest.spyOn(page, 'evaluate').mockImplementationOnce(async () => {
//             return [
//                 {
//                     company: '당근마켓',
//                     image: '',
//                     title: '',
//                     price: '',
//                 },
//             ];
//         });

//         const result = await crawler['evaluatePage'](page, 1);
//         expect(result).toEqual([
//             {
//                 company: '당근마켓',
//                 image: '',
//                 title: '',
//                 price: '',
//             },
//         ]);
//     });
// });


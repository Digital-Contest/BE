import {Crawler} from '../../../src/util/logic/Crawler';
import {CarrotMarketCrawler} from '../../../src/util/logic/CarrotMarketCrawler';
import {SunderMarketCrawler} from '../../../src/util/logic/SunderMarketCrawler';
import {UsedCountryCrawler} from '../../../src/util/logic/UsedCountryCrawler';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');
jest.mock('../../../src/util/logic/CarrotMarketCrawler')
jest.mock('../../../src/util/logic/SunderMarketCrawler')
jest.mock('../../../src/util/logic/UsedCountryCrawler')

describe('Crawler 테스트', () => {
    let mockBrowser: any;
    let mockPage: any;
    let crawler:Crawler;
    const mockCarrotMarketCrawler = new CarrotMarketCrawler() as jest.Mocked<CarrotMarketCrawler>;
    const mockSunderMarketCrawler = new SunderMarketCrawler() as jest.Mocked<SunderMarketCrawler>;
    const mockUsedCountryCrawler = new UsedCountryCrawler() as jest.Mocked<UsedCountryCrawler>;

    beforeEach(()=>{
        crawler = new Crawler(mockCarrotMarketCrawler, mockSunderMarketCrawler, mockUsedCountryCrawler);
        jest.clearAllMocks()
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    mockPage = {
        goto: jest.fn(),
        evaluate: jest.fn(),
        close: jest.fn()
    };

    mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn()
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const carrotResult = [{ company: '당근마켓', title: 'Carrot Laptop', price: '100000원', image: 'carrot.jpg' }];
    const sunderResult = [{ company: '번개장터', title: 'Sunder Laptop', price: '200000원', image: 'sunder.jpg' }];
    const usedResult = [{ company: '중고나라', title: 'Used Laptop', price: '300000원', image: 'used.jpg' }];

    describe('bringCompanyProductPrice 함수 테스트', () => {
        it('bringCompanyProductPrice 함수 정상 처리', async () => {
            const count = 3;
            const searchWord = 'search-word';
            (crawler['carrotMarketCrawler'].crawl as jest.Mock).mockResolvedValue(carrotResult);
            (crawler['sunderMarketCrawler'].crawl as jest.Mock).mockResolvedValue(sunderResult);
            (crawler['usedCountryCrawler'].crawl as jest.Mock).mockResolvedValue(usedResult);
            const result = await crawler.bringCompanyProductPrice(count, searchWord);

            expect(result).toEqual([...carrotResult, ...sunderResult, ...usedResult]);
            expect(puppeteer.launch).toHaveBeenCalledWith({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            expect(mockBrowser.newPage).toHaveBeenCalled();
            expect(mockPage.close).toHaveBeenCalled();
            expect(mockBrowser.close).toHaveBeenCalled();
        });
    });

});
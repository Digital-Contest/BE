
import { SecondhandTradeCount } from '../../src/dto/response/SecondhandTradeCount';
import { Product } from '../../src/entity/Product';
import {Crawler} from '../../src/util/logic/Crawler';
import {QuotationService} from '../../src/service/Quotation.Service';

jest.mock('../../src/util/logic/Crawler');


describe('Quotation Service 테스트', () => {

    let quotationService: QuotationService;
    let mockCrawler: jest.Mocked<Crawler>;

    beforeEach(() => {
        mockCrawler = new Crawler() as jest.Mocked<Crawler>;
        quotationService = new QuotationService(mockCrawler);

        jest.clearAllMocks();
    });

    describe('bringSecondhandTradeCount 함수', () => {
        it('bringSecondhandTradeCount 정상 응답', async () => {
            const count = 1;
            const search = "mock-search";

            const crawlerResult : any = [{},{},{}];

            mockCrawler.bringCompanyProductPrice.mockResolvedValue(crawlerResult);

            const result = await quotationService.bringPlatformQuotation(count, search);

            expect(result).toEqual(crawlerResult);
            expect(mockCrawler.bringCompanyProductPrice).toHaveBeenCalledWith(count, search);
        });
    });


});

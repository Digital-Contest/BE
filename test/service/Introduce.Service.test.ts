import { verifyIntroduceTextCategory, verifyProductCategory } from '../../src/util/verify';
import { getProductCategoryByCondition } from '../../src/util/enum/ProductCategory';
import { getIntroduceTextCategoryByCondition } from '../../src/util/enum/IntroduceTextCategory';
import { openAI } from '../../src/util/openAI';
import { IntroduceTextResponse } from '../../src/dto/response/IntroduceTextResponse';
import { IntroduceService } from '../../src/service/Introduce.Service';
import { checkData } from '../../src/util/checker';

jest.mock('../../src/util/verify');
jest.mock('../../src/util/enum/ProductCategory');
jest.mock('../../src/util/enum/IntroduceTextCategory');
jest.mock('../../src/util/openAI');
jest.mock('../../src/util/checker');

const mockVerifyIntroduceTextCategory = verifyIntroduceTextCategory as jest.Mock;
const mockVerifyProductCategory = verifyProductCategory as jest.Mock;
const mockGetIntroduceTextCategoryByCondition = getIntroduceTextCategoryByCondition as jest.Mock;
const mockGetProductCategoryByCondition = getProductCategoryByCondition as jest.Mock;
const mockOpenAi = openAI as jest.Mock;
const mockCheckData = checkData as jest.Mock;

const introduceService = new IntroduceService();

describe('IntroduceService 테스트', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });


    describe('checkPrice 함수', () => {
        it('checkPrice 가격 존재', () => {
            const price = 1000;

            mockCheckData.mockReturnValue(true);

            const result = introduceService.checkPrice(price);

            expect(result).toEqual(price);
            expect(mockCheckData).toHaveBeenCalledWith(price);
        });

        it('checkPrice 가격 미존재', () => {
            const price = undefined;

            mockCheckData.mockReturnValue(false);

            const result = introduceService.checkPrice(price);

            expect(result).toEqual(50000);
            expect(mockCheckData).toHaveBeenCalledWith(price);
        });
    });

    describe('makeIntroduceText 함수', () => {
        it('makeIntroduceText 정상 응답', async () => {
            const images = ["mock-image1", "mock-image2"];
            const introduceCategory = 'mock-textCategory';
            const price = 1000;
            const productCategory = 'mock-productCategory';
            const product = 'mock-product';

            // Setup mocks
            mockVerifyIntroduceTextCategory.mockImplementation(() => {});
            mockVerifyProductCategory.mockImplementation(() => {});
            mockGetIntroduceTextCategoryByCondition.mockReturnValue('mock-text-content');
            mockGetProductCategoryByCondition.mockReturnValue(1);
            mockOpenAi.mockResolvedValue('mock-introduce-text');

            introduceService.checkPrice = jest.fn().mockReturnValue(price);

            const expectedResponse = IntroduceTextResponse.of('mock-introduce-text', price);

            const result = await introduceService.makeIntroduceText(images, introduceCategory, price, productCategory, product);

            expect(result).toEqual(expectedResponse);
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith('mock-text-content');
            expect(mockVerifyProductCategory).toHaveBeenCalledWith(1);
            expect(mockOpenAi).toHaveBeenCalledWith(images[0], price + product + 'mock-text-content');
            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(productCategory);
            expect(introduceService.checkPrice).toHaveBeenCalledWith(price);
        });
    });


});

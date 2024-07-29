import { verifyIntroduceTextCategory, verifyProductCategory } from '../../src/util/verify';
import { getProductCategoryByCondition } from '../../src/util/enum/ProductCategory';
import { getIntroduceTextCategoryByCondition } from '../../src/util/enum/IntroduceTextCategory';
import { openAI } from '../../src/util/openAI';
import { IntroduceTextResponse } from '../../src/dto/response/IntroduceTextResponse';
import { IntroduceService } from '../../src/service/Introduce.Service';
import { checkData } from '../../src/util/checker';
import { ErrorResponseDto } from '../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../src/exception/ErrorCode';

jest.mock('../../src/util/verify', ()=>({
    verifyIntroduceTextCategory:jest.fn(),
    verifyProductCategory: jest.fn()
}));
jest.mock('../../src/util/enum/ProductCategory',()=>({
    getProductCategoryByCondition : jest.fn()
}));
jest.mock('../../src/util/enum/IntroduceTextCategory',()=>({
    getIntroduceTextCategoryByCondition:jest.fn()
}));
jest.mock('../../src/util/openAI', ()=>({
    openAI: jest.fn()
}));
jest.mock('../../src/util/checker', () => ({
    checkData: jest.fn(),
}));



describe('IntroduceService 테스트', () => {
    let mockGetIntroduceTextCategoryByCondition: jest.Mock;
    let mockGetProductCategoryByCondition: jest.Mock;
    let mockOpenAi: jest.Mock;
    let mockVerifyIntroduceTextCategory: jest.Mock;
    let mockVerifyProductCategory: jest.Mock;
    let introduceService:IntroduceService;
    
    beforeEach(() => {
        mockGetIntroduceTextCategoryByCondition = getIntroduceTextCategoryByCondition as jest.Mock;
        mockGetProductCategoryByCondition = getProductCategoryByCondition as jest.Mock;
        mockOpenAi = openAI as jest.Mock;
        mockVerifyIntroduceTextCategory =  verifyIntroduceTextCategory as jest.Mock;
        mockVerifyProductCategory = verifyProductCategory as jest.Mock;
        introduceService = new IntroduceService(); 
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('makeIntroduceText 함수', () => {

        it('makeIntroduceText 정상 응답', async () => {

            const images = ["mock-image1", "mock-image2"];
            const introduceCategory = '궁서체';
            const price = 1000;
            const productCategory = 'mock-productCategory';
            const product = 'mock-product';
        
           mockGetIntroduceTextCategoryByCondition.mockReturnValue('mock-text-content');
           mockGetProductCategoryByCondition.mockReturnValue(1);
           mockOpenAi.mockResolvedValue('mock-introduce-text');
           introduceService.checkPrice = jest.fn().mockReturnValue(price);
        
           const expectedResponse = IntroduceTextResponse.of('mock-introduce-text', price);
        
           const result = await introduceService.makeIntroduceText(images, introduceCategory, price, productCategory, product);
        
           expect(result).toEqual(expectedResponse);

           expect(mockOpenAi).toHaveBeenCalledWith(images[0], price + product + 'mock-text-content');
           expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
           expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(productCategory);
           expect(introduceService.checkPrice).toHaveBeenCalledWith(price);

        });

        it('makeIntroduceText IntroduceTextCategory 에러처리', async () => {
            const images = ["mock-image1", "mock-image2"];
            const introduceCategory = 'mock';
            const price = 1000;
            const productCategory = 'mock-productCategory';
            const product = 'mock-product';

            mockGetIntroduceTextCategoryByCondition.mockReturnValue(null);
            mockVerifyIntroduceTextCategory.mockImplementation(() => {
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY);
            });
            introduceService.checkPrice = jest.fn().mockReturnValue(price);

            await expect(introduceService.makeIntroduceText(images, introduceCategory, price, productCategory, product))
                .rejects
                .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY));
        
            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith(null); 
            expect(mockOpenAi).not.toHaveBeenCalled();
            expect(mockGetProductCategoryByCondition).not.toHaveBeenCalled();
            expect(introduceService.checkPrice).not.toHaveBeenCalledWith();
        });

        it('makeIntroduceText ProductCategory 에러처리', async () => {
            const images = ["mock-image1", "mock-image2"];
            const introduceCategory = 'mock';
            const price = 1000;
            const productCategory = 'mock-productCategory';
            const product = 'mock-product';
        
            mockGetIntroduceTextCategoryByCondition.mockReturnValue("mock-text-category");
            mockGetProductCategoryByCondition.mockReturnValue(null);
            mockVerifyProductCategory.mockImplementation(() => {
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY);
            });
            introduceService.checkPrice = jest.fn().mockReturnValue(price);
        
            await expect(introduceService.makeIntroduceText(images, introduceCategory, price, productCategory, product))
                .rejects
                .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY));
            
            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(productCategory);
            expect(mockVerifyProductCategory).toHaveBeenCalledWith(null); 
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith("mock-text-category"); 
            expect(mockOpenAi).not.toHaveBeenCalled();
            expect(introduceService.checkPrice).not.toHaveBeenCalled();
        });

     
    });

    describe('checkPrice 함수', () => {


        it('checkPrice 가격 존재', () => {
            (checkData as jest.Mock).mockReturnValue(true);

            const result = introduceService.checkPrice(2000);

            expect(result).toEqual(2000);
            expect((checkData as jest.Mock)).toHaveBeenCalledWith(2000);
        });

        it('checkPrice 가격 미존재', () => {
            (checkData as jest.Mock).mockReturnValue(false);

            const result = introduceService.checkPrice(undefined);

            expect(result).toEqual(50000);
            expect((checkData as jest.Mock)).toHaveBeenCalledWith(undefined);
        });
    });
});

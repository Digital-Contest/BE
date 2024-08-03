import { Product } from "../../src/entity/Product";
import { ErrorCode } from "../../src/exception/ErrorCode";
import { ErrorResponseDto } from "../../src/response/ErrorResponseDto";
import { checkData } from "../../src/util/checker";
import {signVerifyAccessToken, signVerifyRefreshToken, verfiyProduct, verifyIntroduceTextCategory, verifyProductCategory} from '../../src/util/verify';


jest.mock("../../src/util/checker", ()=>({
    checkData: jest.fn()
}))

describe('verify 테스트', () => {

    const mockCheckData = checkData as jest.Mock;
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('verifyIntroduceTextCategory 함수', () => {
        const introduceTextCategoryData = 'test';
        it('verifyIntroduceTextCategory 정상 테스트', () => {
    
            mockCheckData.mockReturnValue(true);
            expect(() => verifyIntroduceTextCategory(introduceTextCategoryData)).not.toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(introduceTextCategoryData);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
        it('verifyIntroduceTextCategory 에러처리', () => {
            mockCheckData.mockReturnValue(false);
            expect(() => verifyIntroduceTextCategory(introduceTextCategoryData)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(introduceTextCategoryData);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
    });

    describe('verifyProductCategory 함수', () => {
        const productCategoryData = 2;
        it('verifyProductCategory 정상 테스트', () => {
            mockCheckData.mockReturnValue(true);
            expect(() => verifyProductCategory(productCategoryData)).not.toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(productCategoryData);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
        it('verifyIntroduceTextCategory 에러처리', () => {
            mockCheckData.mockReturnValue(false);
            expect(() => verifyProductCategory(productCategoryData)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(productCategoryData);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
    });

    describe('verfiyProduct 함수', () => {
        const product = {} as Product
        it('verfiyProduct 정상 테스트', () => {
            mockCheckData.mockReturnValue(true);
            expect(() => verfiyProduct(product)).not.toThrow();
            expect(mockCheckData).toHaveBeenCalledWith( product);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
        it('verfiyProduct 에러처리', () => {
            mockCheckData.mockReturnValue(false);
            expect(() => verfiyProduct(product)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(product);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
    });

    describe('signVerifyAccessToken 함수', () => {

        it('signVerifyAccessToken 정상 테스트', () => {
            const status = true
            expect(() => signVerifyAccessToken(status)).toThrow();

        });
        it('signVerifyAccessToken 에러처리', () => {
            const status = false
            expect(() => signVerifyAccessToken(status)).not.toThrow();
        
        });
    });

    describe('signVerifyRefreshToken 함수', () => {
        it('signVerifyRefreshToken 정상 테스트', () => {
            const status = false
            expect(() => signVerifyRefreshToken(status)).toThrow();
        });
        it('signVerifyRefreshToken 에러처리', () => {
            const status = true
            expect(() => signVerifyRefreshToken(status)).not.toThrow();
        });
    });
});
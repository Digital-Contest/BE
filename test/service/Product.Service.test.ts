import { ProductRepository } from '../../src/repository/Product.Repository';
import { UserRepository } from '../../src/repository/User.Repository';
import { ProductCompanyRepository } from '../../src/repository/ProductCompany.Repository';
import { UserService } from '../../src/service/User.Service';
import { ProductService } from '../../src/service/Product.Service';
import { QueryRunner, Connection } from 'typeorm';
import { Product } from '../../src/entity/Product';
import { ErrorResponseDto } from '../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../src/exception/ErrorCode';
import { ProductList } from '../../src/dto/response/ProductList';
import { formatDate } from '../../src/util/date';
import { ProductCompany } from '../../src/entity/ProductCompany';
import { verifyIntroduceTextCategory, verifyProductCategory, verfiyProduct } from '../../src/util/verify';
import { getProductCategoryByCondition } from '../../src/util/enum/ProductCategory';
import { getIntroduceTextCategoryByCondition } from '../../src/util/enum/IntroduceTextCategory';

// 모듈 모킹
jest.mock('../../src/repository/Product.Repository');
jest.mock('../../src/repository/User.Repository');
jest.mock('../../src/repository/ProductCompany.Repository');
jest.mock('../../src/service/User.Service');
jest.mock('../../src/response/ErrorResponseDto');
jest.mock('../../src/exception/ErrorCode');
jest.mock('../../src/util/date');
jest.mock('../../src/util/verify', () => ({
    verfiyProduct: jest.fn(),
    verifyIntroduceTextCategory: jest.fn(),
    verifyProductCategory: jest.fn()
}));
jest.mock('../../src/util/enum/ProductCategory', () => ({
    getProductCategoryByCondition: jest.fn()
}));
jest.mock('../../src/util/enum/IntroduceTextCategory', () => ({
    getIntroduceTextCategoryByCondition: jest.fn()
}));

jest.mock('../../src/util/decorator/transaction', () => ({
    Transactional: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      // 실제 트랜잭션 동작을 제거하고 단순히 원래 메서드를 호출하도록 합니다.
      return descriptor;
    }
  }));

describe('Product Service 테스트', () => {

    let productService: ProductService;
    let mockProductCompanyRepository: jest.Mocked<ProductCompanyRepository>;
    let mockProductRepository: jest.Mocked<ProductRepository>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockUserService : jest.Mocked<UserService>;
    let mockVerfiyProduct: jest.Mock;
    let connection : jest.Mocked<Connection>;
    const mockFormatDate = formatDate as jest.Mock;
    let mockVerifyIntroduceTextCategory: jest.Mock;
    let mockVerifyProductCategory: jest.Mock;
    let mockGetIntroduceTextCategoryByCondition: jest.Mock;
    let mockGetProductCategoryByCondition: jest.Mock;


    beforeEach(() => {
        mockProductCompanyRepository = new ProductCompanyRepository() as jest.Mocked<ProductCompanyRepository>;
        mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        mockUserService = new UserService({} as any) as jest.Mocked<UserService>;
        mockVerfiyProduct = verfiyProduct as jest.Mock;
        mockVerifyIntroduceTextCategory =  verifyIntroduceTextCategory as jest.Mock;
        mockVerifyProductCategory = verifyProductCategory as jest.Mock;
        mockGetIntroduceTextCategoryByCondition = getIntroduceTextCategoryByCondition as jest.Mock;
        mockGetProductCategoryByCondition = getProductCategoryByCondition as jest.Mock;
    
        productService = new ProductService(
            mockProductRepository,
            mockUserService, 
            mockUserRepository, 
            mockProductCompanyRepository, 
            connection as unknown as Connection
        );


        jest.clearAllMocks();
    });


    afterEach(() => {
        jest.resetAllMocks();
    });


    describe('modifyProductStatus 함수', () => {

        const userId = 2;
        const productId = 4;
        const status = false;

        it('modifyProductStatus 정상 처리', async () => {

            const mockProduct =
                Product.createProduct(1, 'url1', 'category1', 100, 'productCategory1', 'product1', 'text1');
              
            mockProductRepository.findProductById.mockResolvedValue(mockProduct);
            mockProductRepository.updateProductStatus.mockResolvedValue(undefined);
            mockUserService.modifyUserScoreAccordingToProductStatus.mockResolvedValue(undefined);

            await productService.modifyProductStatus(userId, productId, status)

            expect(mockProductRepository.findProductById).toHaveBeenCalledWith(productId);
            expect(mockVerfiyProduct).toHaveBeenCalledWith(mockProduct);
            expect(mockProductRepository.updateProductStatus).toHaveBeenCalledWith(userId, productId, status);
            expect(mockUserService.modifyUserScoreAccordingToProductStatus).toHaveBeenCalledWith(status, mockProduct, userId);

        });
        

        it('modifyProductStatus - 제품이 없는 경우 예외 처리', async () => {

            mockProductRepository.findProductById.mockResolvedValue(null);
            mockVerfiyProduct.mockImplementation(() => {
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT)
            });

            await expect(productService.modifyProductStatus(userId, productId, status))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT));

            expect(mockProductRepository.findProductById).toHaveBeenCalledWith(productId);
            expect(mockVerfiyProduct).toHaveBeenCalledWith(null);
            expect(mockProductRepository.updateProductStatus).not.toHaveBeenCalled();
            expect(mockUserService.modifyUserScoreAccordingToProductStatus).not.toHaveBeenCalled();

        });

      
    });



    describe('bringMyProduct 함수', () => {

        it('bringMyProduct 정상 처리', async () => {
            const userId = 1;
            const status = 'true';

            const productCompany1 = new ProductCompany('Company1', 1);
            const productCompany2 = new ProductCompany('Company2', 2);

            const products = [
                new Product(
                    1, 
                    'url1',
                    'category1',
                    100,
                    'productCategory1',
                    'product1',
                    'introduceText1' 
                ) as unknown as Product,
                new Product(
                    2, 
                    'url2',
                    'category2',
                    200,
                    'productCategory2',
                    'product2',
                    'introduceText2' 
                ) as unknown as Product
            ];
            products[0].productCompanys = [productCompany1];
            products[1].productCompanys = [productCompany2];
            products[0].id = 1;
            products[1].id = 2;

            mockProductRepository.findProductAndProductCompanyByUserIdAndStatus.mockResolvedValue(products);
            mockFormatDate.mockReturnValue('2024년1월1일')

            const mappingSpy = jest.spyOn(productService as any, 'mappingMyProductData');
            const changeTypeSpy = jest.spyOn(productService as any, 'changeType' as any);

            const productList = [
                new ProductList(1, 'product1', 'productCategory1', 'url1', '2024년1월1일', ['Company1'], 100),
                new ProductList(2, 'product2', 'productCategory2', 'url2', '2024년1월1일', ['Company2'], 200)
            ];

            const bringMyProductResponse = ProductList.of(productList);

            const result = await productService.bringMyProduct(userId, status);

            expect(result).toEqual(bringMyProductResponse);
            expect(changeTypeSpy).toHaveBeenCalledWith(status);
            expect(mappingSpy).toHaveBeenCalledWith(products);
            expect(mockProductRepository.findProductAndProductCompanyByUserIdAndStatus).toHaveBeenCalledWith(userId, true);
            }); 
    });


    describe('pentrateProduct 함수', () => {
        const userId = 1;
        const imageUrl = 'mock-url';
        const introduceCategory = 'mock-introduceCategory';
        const price = 1000;
        const productCategory = 'mock-productCategory';
        const product = 'mock-product';
        const introduceText = 'mock-introduceText';
        const companys = ['company1', 'company2'];

        const productData = {getId:jest.fn().mockReturnValue(1)} as unknown as Product;

        it('pentrateProduct 정상 처리', async () => {

            mockGetIntroduceTextCategoryByCondition.mockReturnValue("mock-text-category");
            mockGetProductCategoryByCondition.mockReturnValue(1);
            mockProductRepository.insertProduct.mockResolvedValue(productData);

            await productService.pentrateProduct(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText, companys);
       
            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith("mock-text-category"); 
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(productCategory);
            expect(mockVerifyProductCategory).toHaveBeenCalledWith(1); 
            expect(mockProductRepository.insertProduct).toHaveBeenCalledWith(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText);
            expect(mockProductCompanyRepository.insertProductCompanys).toHaveBeenCalledWith(companys, productData.getId());
   
        }); 



        it('pentrateProduct verifyIntroduceTextCategory 에러 처리', async () => {
            mockGetIntroduceTextCategoryByCondition.mockReturnValue(null);
            mockVerifyIntroduceTextCategory.mockImplementation(() => {
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY);
            });

            await expect(productService.pentrateProduct(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText, companys))
                .rejects.toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_INTRODUCE_CATEGORY));

            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith(null);
            expect(mockVerifyProductCategory).not.toHaveBeenCalled();
            expect(mockGetProductCategoryByCondition).not.toHaveBeenCalled();
            expect(mockProductRepository.insertProduct).not.toHaveBeenCalled();
            expect(mockProductCompanyRepository.insertProductCompanys).not.toHaveBeenCalled();
        });

        it('pentrateProduct verifyProductCategory 에러 처리', async () => {

            mockGetIntroduceTextCategoryByCondition.mockReturnValue("mock-text-category");
            mockGetProductCategoryByCondition.mockReturnValue(null);
            mockVerifyProductCategory.mockImplementation(() => {
                throw  ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY);
            });

            await expect(productService.pentrateProduct(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText, companys))
                .rejects.toEqual( ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT_CATEGORY));

            expect(mockGetIntroduceTextCategoryByCondition).toHaveBeenCalledWith(introduceCategory);
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(productCategory);
            expect(mockVerifyProductCategory).toHaveBeenCalledWith(null); 
            expect(mockVerifyIntroduceTextCategory).toHaveBeenCalledWith("mock-text-category"); 
            expect(mockProductRepository.insertProduct).not.toHaveBeenCalled();
            expect(mockProductCompanyRepository.insertProductCompanys).not.toHaveBeenCalled();
   
        }); 

   
    });



    });


    






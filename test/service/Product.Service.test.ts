import { ProductRepository } from '../../src/repository/Product.Repository';
import { UserRepository } from '../../src/repository/User.Repository';
import {ProductCompanyRepository} from '../../src/repository/ProductCompany.Repository';
import {UserService} from '../../src/service/User.Service';
import {ProductService} from '../../src/service/Product.Service';
import { Connection } from 'typeorm';
import { Product } from '../../src/entity/Product';
import { ErrorResponseDto } from '../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../src/exception/ErrorCode';
import { ProductList } from '../../src/dto/response/ProductList';
import { formatDate } from '../../src/util/date';
import { ProductCompany } from '../../src/entity/ProductCompany';

jest.mock('../../src/repository/Product.Repository');
jest.mock('../../src/repository/User.Repository');
jest.mock('../../src/repository/ProductCompany.Repository');
jest.mock('../../src/service/User.Service');
jest.mock('../../src/response/ErrorResponseDto');
jest.mock('../../src/exception/ErrorCode')
jest.mock('../../src/util/date')


describe('Product Service 테스트', () => {

    let productService: ProductService;
    let mockProductCompanyRepository: jest.Mocked<ProductCompanyRepository>;
    let mockProductRepository: jest.Mocked<ProductRepository>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockUserService : jest.Mocked<UserService>;
    let connection : jest.Mocked<Connection>;
    const mockFormatDate = formatDate as jest.Mock;


    beforeEach(() => {
        mockProductCompanyRepository = new ProductCompanyRepository() as jest.Mocked<ProductCompanyRepository>;
        mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        mockUserService = new UserService({} as any) as jest.Mocked<UserService>;
    
        productService = new ProductService(
            mockProductRepository,
            mockUserService, 
            mockUserRepository, 
            mockProductCompanyRepository, 
            connection);

        jest.clearAllMocks();
    });

    describe('modifyProductStatus 함수', () => {

        it('modifyProductStatus - 제품이 없는 경우 예외 처리', async () => {
            const userId = 2;
            const productId = 4;
            const status = false;

            mockProductRepository.findProductById.mockResolvedValue(null);

            await expect(productService.modifyProductStatus(userId, productId, status))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT));

            expect(mockProductRepository.findProductById).toHaveBeenCalledWith(productId);
            expect(mockProductRepository.updateProductStatus).not.toHaveBeenCalled();
            expect(mockUserService.modifyUserScoreAccordingToProductStatus).not.toHaveBeenCalled();

        });

        it('modifyProductStatus 정상 처리', async () => {

            const userId = 1;
            const productId = 2;
            const status = true;
            const mockProduct =
                Product.createProduct(1, 'url1', 'category1', 100, 'productCategory1', 'product1', 'text1');
              
            mockProductRepository.findProductById.mockResolvedValue(mockProduct);
            mockProductRepository.updateProductStatus.mockResolvedValue(undefined);
            mockUserService.modifyUserScoreAccordingToProductStatus.mockResolvedValue(undefined);

            await productService.modifyProductStatus(userId, productId, status);

            expect(mockProductRepository.findProductById).toHaveBeenCalledWith(productId);
            expect(mockProductRepository.updateProductStatus).toHaveBeenCalledWith(userId, productId, status);
            expect(mockUserService.modifyUserScoreAccordingToProductStatus).toHaveBeenCalledWith(status, mockProduct, userId);

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


    


});



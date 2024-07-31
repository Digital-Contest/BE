import {ProductService} from '../../src/service/Product.Service'
import {ProductController} from '../../src/controller/Product.Controller'
import { Request, Response } from 'express';
import { ProductStatus } from '../../src/dto/request/ProductStatus';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import { ProductList } from '../../src/dto/response/ProductList';
import { ProductCreate } from '../../src/dto/request/ProductCreat';

declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { user_id: number };
    }
}

jest.mock('../../src/service/Product.Service')

const mockProductService = new ProductService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
) as jest.Mocked<ProductService>;

const productController = new ProductController(mockProductService)

describe('Product Controller test', ()=>{

    beforeEach(() => {
        jest.clearAllMocks();
      });
    

    describe('PATCH /product/status', ()=>{

        it('modifyProductStatus 함수', async()=>{

            const req = {decoded:{user_id:1}} as Request;
            const productStatus = new ProductStatus();
            productStatus.getProductId = jest.fn().mockReturnValue(1);
            productStatus.getStatus = jest.fn().mockReturnValue(true);

            mockProductService.modifyProductStatus.mockResolvedValue(undefined);

            const result = await productController.modifyProductStatus(req, productStatus);

            expect(result).toEqual(SuccessResponseDto.of());
            expect(mockProductService.modifyProductStatus).toHaveBeenCalledWith(req.decoded?.user_id, productStatus.getProductId(), productStatus.getStatus());
        });
    });


    describe('GET /product', ()=>{

        it('bringMyProduct 함수', async()=>{

            const req = {decoded:{user_id:1}} as Request;
            const status = 'mock-status';
            const productList = [
                new ProductList(1, 'Product1', 'Category1', 'ImageUrl1', '2024-07-28', ['Company1'], 100),
                new ProductList(2, 'Product2', 'Category2', 'ImageUrl2', '2024-07-29', ['Company2'], 200)
            ];

            const bringMyProductResponse = ProductList.of(productList);
            mockProductService.bringMyProduct.mockResolvedValue(bringMyProductResponse);

            const result = await productController.bringMyProduct(req, status);

            expect(result).toEqual(SuccessResponseDto.of(bringMyProductResponse));
            expect(mockProductService.bringMyProduct).toHaveBeenCalledWith(req.decoded?.user_id, status);
          
        });
    });

    describe('POST /product', ()=>{

        it('pentrateProduct 함수', async()=>{

            const req = {
                decoded: { user_id: 1 },
                files: [
                    { location: 'http://example.com/image1.jpg' },
                    { location: 'http://example.com/image2.jpg' }
                ]
            } as unknown as Request;

            const productCreate = {
                getIntroduceCategory: jest.fn().mockReturnValue('category1'),
                getPrice: jest.fn().mockReturnValue(100),
                getProductCategory: jest.fn().mockReturnValue('category2'),
                getProduct: jest.fn().mockReturnValue('product1'),
                getIntroduceText: jest.fn().mockReturnValue('introduce text'),
                getCompanys: jest.fn().mockReturnValue(['company1'])
            } as unknown as ProductCreate;

            mockProductService.pentrateProduct.mockResolvedValueOnce(undefined);

            const result = await productController.pentrateProduct(req, productCreate);

            expect(result).toEqual(SuccessResponseDto.of());
            expect(mockProductService.pentrateProduct).toHaveBeenCalledWith(
                req.decoded!.user_id,
                ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
                'category1',
                100,
                'category2',
                'product1',
                'introduce text',
                ['company1']
            );
        });
    });


});
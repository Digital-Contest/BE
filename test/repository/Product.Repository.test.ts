import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { Product } from '../../src/entity/Product';
import { ProductRepository } from '../../src/repository/Product.Repository';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Satisfaction } from '../../src/dto/response/Satisfaction';
import { ProductCompany } from '../../src/entity/ProductCompany';


const mockProducts = [{} as unknown as Product ] as unknown as Product[];
const mockProduct = {} as unknown as Product;
const mockSatiafcations = [
    {} as unknown as Satisfaction
] as unknown as Satisfaction[];
const anyData = [{}] as any[]

const mockSelectQueryBuilder = {
    innerJoinAndSelect:jest.fn().mockReturnThis(),
    innerJoin:jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy:jest.fn().mockReturnThis(),
    orderBy:jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(mockProduct),
    getMany: jest.fn().mockResolvedValue(mockProducts),
    getRawMany: jest.fn().mockResolvedValue(anyData)
} as unknown as SelectQueryBuilder<Product>;

const mockUpdateQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as UpdateQueryBuilder<Product>;

describe('ProductCompanyRepository', () => {
    let productRepository: ProductRepository;
    const mockProductyRepository = mockDeep<Repository<Product>>();


    beforeEach(() => {
        mockReset(mockProductyRepository);
        productRepository = new ProductRepository();
        productRepository['save'] = mockProductyRepository.save;
        productRepository['createQueryBuilder'] = mockProductyRepository.createQueryBuilder;
    });

    describe('findSecondhandTradeCount', () => {
        it('findSecondhandTradeCount 정상 테스트', async () => {
            const userId = 1;
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder as any);
            const result = await productRepository.findSecondhandTradeCount(userId);
            expect(result).toEqual(mockProducts);
            expect(productRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('p');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(Product, 'p')
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('p.user_id = :userId',{userId});
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('p.status = true');
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });

    describe('updateProductStatus', () => {
        it('updateProductStatus 정상 테스트', async () => {
            const userId = 1;
            const productId = 2;
            const status = true;
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as any);
            const result = await productRepository.updateProductStatus(userId, productId, status);
            expect(result).toEqual({affected:1});
            expect(productRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(Product);
            expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({status:status});
            expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :productId',{productId});
            expect(mockUpdateQueryBuilder.andWhere).toHaveBeenCalledWith('user_id = :userId',{userId});
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe('findProductById', () => {
        it('findProductById 정상 테스트', async () => {
            const productId = 2;
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder as any);
            const result = await productRepository.findProductById(productId);
            expect(result).toEqual(mockProduct);
            expect(productRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('p');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(Product, 'p')
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('p.id = :productId',{productId});
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });

    describe('findProductAndProductCompanyByUserIdAndStatus', () => {
        it('findProductAndProductCompanyByUserIdAndStatus 정상 테스트', async () => {
            const userId = 2;
            const status = true;
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder as any);
            const result = await productRepository.findProductAndProductCompanyByUserIdAndStatus(userId, status);
            expect(result).toEqual(mockProducts);
            expect(productRepository['createQueryBuilder']).toHaveBeenCalledWith('p');
            expect(mockSelectQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('p.productCompanys', 'pc');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('p.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('(p.status = :status OR p.status IS :status)', { status });
            expect(mockSelectQueryBuilder.orderBy).toHaveBeenCalledWith('p.created_at', 'DESC')
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });

    describe('insertProduct', () => {

        const mockProduct =  {
            createdAt: undefined,
            id: undefined,
            imageUrl: "mock-image",
            introduceText: "text",
            introduceTextCategory: "introduce-category",
            name: "product",
            price: 2000,
            productCategory: "product-category",
            productCompanys: undefined,
            status: undefined,
            updateAt: undefined,
            user: undefined,
            userId: 1,
             } as unknown as Product;

        it('insertProduct 정상 테스트', async () => {
            const userId=1;
            const imageUrl="mock-image";
            const introduceCategory="introduce-category";
            const price=2000;
            const productCategory="product-category";
            const product='product';
            const introduceText="text";
            productRepository['save'] = jest.fn().mockResolvedValue(mockProduct);
            const result = await productRepository.insertProduct(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText);
            expect(result).toEqual(mockProduct);
            expect(productRepository['save']).toHaveBeenCalledTimes(1);
            expect(productRepository['save']).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('findWholePlatformSatisfaction', () => {
        it('findWholePlatformSatisfaction 정상 테스트', async () => {
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder as any);
            mockProductyRepository.createQueryBuilder.mockReturnValueOnce({
                ...mockSelectQueryBuilder,
                getRawMany: jest.fn().mockResolvedValue(mockSatiafcations) 
            } as any);
            const result = await productRepository.findWholePlatformSatisfaction();
            expect(result).toEqual(mockSatiafcations);
            expect(productRepository['createQueryBuilder']).toHaveBeenCalledWith('p');
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith([
                'pc.company AS target',
                'p.introduceTextCategory AS introduceTextCategory',
                'COUNT(p.introduceTextCategory) AS introduceTextCategoryCount'
            ]);
            expect(mockSelectQueryBuilder.innerJoin).toHaveBeenCalledWith(ProductCompany, 'pc', 'pc.product_id = p.id');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('p.status = true');
            expect(mockSelectQueryBuilder.groupBy).toHaveBeenCalledWith('pc.company, p.introduceTextCategory');
            expect(mockSelectQueryBuilder.orderBy).toHaveBeenCalledWith('introduceTextCategoryCount', 'DESC')
            expect(mockSelectQueryBuilder.getRawMany).toHaveBeenCalled();
        });
    });






});

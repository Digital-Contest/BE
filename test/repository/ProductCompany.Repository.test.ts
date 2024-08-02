import { Repository } from 'typeorm';
import { ProductCompany } from '../../src/entity/ProductCompany';
import { ProductCompanyRepository } from '../../src/repository/ProductCompany.Repository';
import { mockDeep, mockReset,} from 'jest-mock-extended';

const mockProductCompanies: ProductCompany[] = [
    { productId: 1, company: 'Company1', createdAt:undefined, id:undefined, product:undefined, updateAt:undefined } as unknown as ProductCompany,
];



describe('ProductCompanyRepository', () => {
    let productCompanyRepository: ProductCompanyRepository;
    const mockProductCompanyRepository = mockDeep<Repository<ProductCompany>>();


    beforeEach(() => {
        mockReset(mockProductCompanyRepository);
        productCompanyRepository = new ProductCompanyRepository();
        productCompanyRepository['save'] = mockProductCompanyRepository.save;
    });

    describe('insertProductCompanys', () => {
        it('insertProductCompanys 정상 테스트', async () => {
            const companies = ['Company1'];
            const productId = 1;
            await productCompanyRepository.insertProductCompanys(companies, productId);
            expect(productCompanyRepository['save']).toHaveBeenCalledTimes(1);
            expect(productCompanyRepository['save']).toHaveBeenCalledWith(mockProductCompanies);
        });
    });
});

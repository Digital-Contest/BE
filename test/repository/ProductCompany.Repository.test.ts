import { getRepository, Repository } from 'typeorm';
import { ProductCompany } from '../../src/entity/ProductCompany';
import {ProductCompanyRepository} from '../../src/repository/ProductCompany.Repository'


jest.mock('../../src/entity/ProductCompany', () => ({
    createProductCompany: jest.fn(),
}));



const mockProductCompany = {

} as unknown as ProductCompany;
  

describe('ProductCompanyRepository 테스트', () => {
    let productCompanyRepository: ProductCompanyRepository;


    beforeEach(() => {
        productCompanyRepository = new ProductCompanyRepository();
        jest.clearAllMocks();
    });
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('insertProductCompanys 함수', () => {

        const mockSave = jest.spyOn(productCompanyRepository as any, 'save').mockImplementation(jest.fn());

        it('insertProductCompanys 정상 ', async () => {
            const companies = ['company1', 'company2'];
            const productId = 2;
            const savedCompanies = companies.map((data) => ({
                data,
                productId,
              }));
            mockSave.mockResolvedValue(savedCompanies);
            

           

        });

    });
});
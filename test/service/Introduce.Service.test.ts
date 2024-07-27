import {verifyIntroduceTextCategory, verifyProductCategory} from '../../src/util/verify'
import {getProductCategoryByCondition} from '../../src/util/enum/ProductCategory'
import {getIntroduceTextCategoryByCondition} from '../../src/util/enum/IntroduceTextCategory'



const mockVerifyIntroduceTextCategory = verifyIntroduceTextCategory as jest.Mock
const mockVerifyProductCategory = verifyProductCategory as jest.Mock;
const mockGetIntroduceTextCategoryByCondition = getIntroduceTextCategoryByCondition as jest.Mock;


describe('Introduce Service 테스트', ()=>{


    it('makeIntroduceText 함수', async ()=>{



        const mockImages = ["mock-image1", "mock-image2"];
        const introduceCategory = 'mock-궁서체';
        const price = 10000;
        const productCategory = 'mock-productCategory';
        const product = 'mock-product';







    })
})
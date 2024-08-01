import { UserNickname } from '../../src/dto/response/UserNickname';
import { Product } from '../../src/entity/Product';
import { User } from '../../src/entity/User';
import {UserRepository} from '../../src/repository/User.Repository';
import { UserService } from '../../src/service/User.Service';
import {getProductCategoryByCondition} from '../../src/util/enum/ProductCategory'





jest.mock('../../src/repository/User.Repository')
jest.mock('../../src/util/enum/ProductCategory', () => ({
    getProductCategoryByCondition: jest.fn()             
}))

const mockUser = { getNickname: jest.fn().mockReturnValue('mock-nickname')} as unknown as User;

describe('User Service 테스트', ()=>{

    
    const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const mockGetProductCategoryByCondition = getProductCategoryByCondition as  jest.Mock;
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(mockUserRepository);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('bringNickname 함수', ()=>{

        it('bringNickname 정상 처리', async () => {
            const userId = 1;
            mockUserRepository.findUserById.mockResolvedValue(mockUser);
            const bringNicknameResponse = UserNickname.of(mockUser.getNickname());
            const result = await userService.bringNickname(userId);
            expect(result).toEqual(bringNicknameResponse);
            expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
        });
    });

    describe('modifyUserScoreAccordingToProductStatus 함수', ()=>{

        const product = { getProductCategory: jest.fn().mockReturnValue('mock-productCategory')} as unknown as Product;
        const userId = 1;
        
        it('modifyUserScoreAccordingToProductStatus status true 처리', async () => {
            const status = true;
            const productCategoryScore = 100
            mockGetProductCategoryByCondition.mockReturnValue('mock-productCategoryByCondition');
            await userService.modifyUserScoreAccordingToProductStatus(status, product, userId);
            expect(getProductCategoryByCondition).toHaveBeenCalledWith(product.getProductCategory());
            expect(mockUserRepository.updateUserScore(userId, productCategoryScore));
        });

        it('modifyUserScoreAccordingToProductStatus status false 처리', async () => {
            const status = false;
            await userService.modifyUserScoreAccordingToProductStatus(status, product, userId);
            expect(mockGetProductCategoryByCondition).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUserScore).not.toHaveBeenCalled();
        });
    });

});
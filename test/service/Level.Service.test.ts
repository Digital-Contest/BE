import { LevelColor } from '../../src/dto/response/LevelColor';
import { LevelInformation } from '../../src/dto/response/LevelInformation';
import { SecondhandTradeCount } from '../../src/dto/response/SecondhandTradeCount';
import { Product } from '../../src/entity/Product';
import { User } from '../../src/entity/User';
import { ProductRepository } from '../../src/repository/Product.Repository';
import { UserRepository } from '../../src/repository/User.Repository';
import { LevelService } from '../../src/service/Level.Service';
import {getLevelByScore, getLevelExperience, getMyLevelExperience, getLevelColor} from '../../src/util/enum/Level'


jest.mock('../../src/repository/Product.Repository');
jest.mock('../../src/repository/User.Repository');
jest.mock('../../src/util/enum/Level')


const mockUser = {
    getScore : jest.fn().mockReturnValue(12)
} as unknown as User;

const mockGetLevelByScore = getLevelByScore as jest.Mock;
const mockGetLevelExperience = getLevelExperience as jest.Mock;
const mockGetMyLevelExperience = getMyLevelExperience as jest.Mock;
const mockGetLevelColor = getLevelColor as jest.Mock;

describe('Level Service 테스트', () => {
    let levelService: LevelService;
    let mockProductRepository: jest.Mocked<ProductRepository>;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        levelService = new LevelService(mockProductRepository, mockUserRepository);

        jest.clearAllMocks();
    });

    describe('bringSecondhandTradeCount 함수', () => {
        it('bringSecondhandTradeCount 정상 응답', async () => {
            const userId = 1;
            const findSecondhandTradeCountResponse = [
                Product.createProduct(1, 'url1', 'category1', 100, 'productCategory1', 'product1', 'text1'),
                Product.createProduct(1, 'url2', 'category2', 200, 'productCategory2', 'product2', 'text2')
            ];
            const bringSecondhandTradeCountResponse = SecondhandTradeCount.of(findSecondhandTradeCountResponse.length);

            mockProductRepository.findSecondhandTradeCount.mockResolvedValue(findSecondhandTradeCountResponse);

            const result = await levelService.bringSecondhandTradeCount(userId);

  
            expect(result).toEqual(bringSecondhandTradeCountResponse);
            expect(mockProductRepository.findSecondhandTradeCount).toHaveBeenCalledWith(userId);
        });
    });


    describe('bringLevelInformation 함수', () => {

        it('bringLevelInformation 정상 응답', async () => {
            const userId = 1;
    
            mockUserRepository.findUserById.mockResolvedValue(mockUser);
            mockGetLevelByScore.mockReturnValue(3);
            mockGetLevelExperience.mockReturnValue(10);
            mockGetMyLevelExperience.mockReturnValue(7);

            const bringLevelInformationResponse = LevelInformation.of(10, 7, 3);

            const result = await levelService.bringLevelInformation(userId);
      
            expect(result).toEqual(bringLevelInformationResponse);
            expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockGetLevelByScore).toHaveBeenCalledWith(mockUser.getScore());
            expect(mockGetLevelExperience).toHaveBeenCalledWith(3);
            expect(mockGetMyLevelExperience).toHaveBeenCalledWith(3, mockUser.getScore());
        });
    });



    describe('bringLevelColor 함수', () => {

        it('bringLevelColor 정상 응답', async () => {
            const userId = 1;
    
            mockUserRepository.findUserById.mockResolvedValue(mockUser);
            mockGetLevelByScore.mockReturnValue(3);
            mockGetLevelColor.mockReturnValue('mock-color');

            const bringLevelColorResponse = LevelColor.of('mock-color');

            const result = await levelService.bringLevelColor(userId);


            expect(result).toEqual(bringLevelColorResponse);
            expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockGetLevelByScore).toHaveBeenCalledWith(mockUser.getScore());
            expect(mockGetLevelColor).toHaveBeenCalledWith(430);
          
        });
    });







});

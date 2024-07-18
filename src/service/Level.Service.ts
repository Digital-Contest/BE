import { Service } from 'typedi';;
import { Product } from '../entity/Product';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '../repository/Product.Repository';
import { SecondhandTradeCount } from '../dto/response/SecondhandTradeCount';
import { LevelInformation } from '../dto/response/LevelInformation';
import { User } from '../entity/User';
import { UserRepository } from '../repository/User.Repository';
import { getLevelByScore, getLevelColor, getLevelExperience, getMyLevelExperience, LevelExperience } from '../util/enum/Level';
import { LevelColor } from '../dto/response/LevelColor';




@Service()
export class LevelService {

    constructor(
        @InjectRepository(Product) private readonly productRepository: ProductRepository,
        @InjectRepository(User) private readonly userRepository: UserRepository,
    ) {}


    /**
     * 팔린 중고거래 상품을 조회하는 응용 서비스 함수
     * @param userId 유저 id
     * @returns 중고거래 완료 물품 개수
     */
    async bringSecondhandTradeCount(userId:number):Promise<SecondhandTradeCount> {
        const secondhandTradeCount = await this.productRepository.findSecondhandTradeCount(userId);
        return SecondhandTradeCount.of(secondhandTradeCount.length)
    }

    /**
     * 유저 레벨 정보(내 레벨, 레벨 경험치, 내 레벨 경험치) 조회 함수
     * @param userId 유저 id
     * @returns 유저 레벨 정보 
     */
    async bringLevelInformation(userId:number):Promise<LevelInformation> {
        const userData = await this.userRepository.findUserById(userId);
        const myLevel = getLevelByScore(userData.getScore());
        return LevelInformation.of(getLevelExperience(myLevel), getMyLevelExperience(myLevel, userData.getScore()), myLevel);
    }

    /**
     * 레벨별 색상 조회 함수
     * @param userId 유저 id
     * @returns 레벨의 색상 
     */
    async bringLevelColor(userId:number):Promise<LevelColor> {
        const userData = await this.userRepository.findUserById(userId);
        const myLevel = getLevelByScore(userData.getScore());
        return LevelColor.of(getLevelColor(LevelExperience[`LEVEL_${myLevel}` as keyof typeof LevelExperience]));
    }



}

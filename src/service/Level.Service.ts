import { Service } from 'typedi';;
import { createRequire } from 'module'
import { Product } from '../entity/Product.js';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '../repository/Product.Repository.js';
import { SecondhandTradeCount } from '../dto/response/SecondhandTradeCount.js';




@Service()
export class LevelService {

    constructor(
        @InjectRepository(Product) private readonly productRepository: ProductRepository
    ) {}


    /**
     * 팔린 중고거래 상품을 조회하는 응용 서비스 함수
     * @param userId 유저 id
     * @returns 중고거래 완료 물품 개수
     */
    async bringSecondhandTradeCount(userId:number):Promise<SecondhandTradeCount> {
        const secondhandTradeCount = await this.productRepository.findSecondhandTradeCount(userId);
        console.log(secondhandTradeCount)
        return SecondhandTradeCount.of(secondhandTradeCount)
    }



}

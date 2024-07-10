import { EntityRepository, Repository } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../entity/Product.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * User DAO Class
 */

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    /**
     * 중고 거래 횟수를 조회하는 함수
     * @param userId 유저 id
     * @returns 
     */
    public findSecondhandTradeCount(userId:number):Promise<number>{
        return this.createQueryBuilder()
            .select()
            .from(Product, 'p')
            .where('p.id = :userId',{userId})
            .andWhere('p.status = 1')
            .getCount();
    }


  

 }
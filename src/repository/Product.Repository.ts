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
    public async findSecondhandTradeCount(userId:number):Promise<number>{
        return this.createQueryBuilder()
            .select()
            .from(Product, 'p')
            .where('p.id = :userId',{userId})
            .andWhere('p.status = 1')
            .getCount();
    }

    /**
     * 물품 상태를  업데이트하는 함수  false -> 실패, true -> 성공
     * @param userId 유저 id
     * @param productId 물품 id
     */
    public async updateProductStatus(userId:number, productId:number, status:boolean){
        return this.createQueryBuilder()
            .update(Product)
            .set({status:status})
            .where('id = :productId',{productId})
            .andWhere('user_id = :userId',{userId})
            .execute();
    }

    /**
     * 물품 id에 따라 물품 엔티티를 조회하는 함수
     * @param productId 물품 id
     * @returns 물품 엔티티
     */
    public async findProductById(productId:number){
        return this.createQueryBuilder()
            .select('p')
            .from(Product, 'p')
            .where('p.id = :productId',{productId})
            .getOne();
    }




  

 }
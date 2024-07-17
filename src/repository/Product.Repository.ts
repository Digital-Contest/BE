import { EntityRepository, Repository } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../entity/Product.js';
import { ProductCreate } from '../dto/request/ProductCreat.js';
import { User } from '../entity/User.js';
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
    public async findSecondhandTradeCount(userId:number){
        return this.createQueryBuilder()
            .select('p')
            .from(Product, 'p')
            .where('p.user_id = :userId',{userId})
            .andWhere('p.status = true')
            .getMany();
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


    /**
     * 상태에 Product, ProductCompany 조회 함수 
     * @param userId 유저 id
     * @param status 물품 상태
     * @returns Product, ProductCompany 엔티티s
     */
    public async findProductAndProductCompanyByUserIdAndStatus(userId: number, status: boolean | null) {
        return this.createQueryBuilder('p')
            .innerJoinAndSelect('p.productCompanys', 'pc')
            .where('p.user_id = :userId', { userId })
            .andWhere('(p.status = :status OR p.status IS :status)', { status })
            .orderBy('p.created_at', 'DESC')
            .getMany();
    }


    public async insertProduct(
     //   user:User, 
     userId:number,
      imageUrl:string, introduceCategory:string, price:number, productCategory:string,
     product:string, introduceText:string):Promise<Product>{
        const newProduct = Product.createProduct(
           userId, 
           imageUrl, introduceCategory, price, productCategory, product, introduceText );
       return this.save(newProduct);

    }




  

 }
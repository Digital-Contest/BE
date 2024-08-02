import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entity/Product';
import { ProductCompany } from '../entity/ProductCompany';
import {  Satisfaction } from '../dto/response/Satisfaction';


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

    /**
     * 물품 등록 함수
     * @param userId 유저 id
     * @param imageUrl 상품 이미지
     * @param introduceCategory 소개 카테고리
     * @param price 물품 가격
     * @param productCategory 물품 카테고리 
     * @param product 물품명
     * @param introduceText 소개글
     * @returns 
     */
    public async insertProduct(userId:number, imageUrl:string, introduceCategory:string, price:number, productCategory:string,
     product:string, introduceText:string):Promise<Product>{
        const newProduct = Product.createProduct(
           userId, 
           imageUrl, introduceCategory, price, productCategory, product, introduceText );
       return this.save(newProduct);

    }


    /**
     * 플랫폼별 선호 말투 조회 함수
     * @returns 
     */
    public async findWholePlatformSatisfaction(): Promise<Satisfaction[]> {
        const result = await this.createQueryBuilder('p')
            .select([
                'pc.company AS target',
                'p.introduceTextCategory AS introduceTextCategory',
                'COUNT(p.introduceTextCategory) AS introduceTextCategoryCount'
            ])
            .innerJoin(ProductCompany, 'pc', 'pc.product_id = p.id')
            .where('p.status = true')
            .groupBy('pc.company, p.introduceTextCategory')
            .orderBy('introduceTextCategoryCount', 'DESC')
            .getRawMany();
        return result.map((data)=> Satisfaction.of(data.target, data.introduceTextCategory, data.introduceTextCategoryCount))    
    }



    /**
     * 내 판매 완료 상품의 플랫폼별 선호 말투 조회 함수
     * @param userId 유저 id
     * @returns 
     */
    public async findMinePlatformSatisfaction(userId:number): Promise<Satisfaction[]> {
        const result = await this.createQueryBuilder('p')
            .select([
                'pc.company AS target',
                'p.introduceTextCategory AS introduceTextCategory',
                'COUNT(p.introduceTextCategory) AS introduceTextCategoryCount'
            ])
            .innerJoin(ProductCompany, 'pc', 'pc.product_id = p.id')
            .where('p.status = true')
            .andWhere('p.user_id = :userId',{userId})
            .groupBy('pc.company, p.introduceTextCategory')
            .orderBy('introduceTextCategoryCount', 'DESC')
            .getRawMany();
        return result.map((data)=> Satisfaction.of(data.target, data.introduceTextCategory, data.introduceTextCategoryCount))    
    }




   
    /**
     * 카테고리별 선호 말투 조회 함수
     * @returns 
     */
    public async findWholeCategorySatisfaction(): Promise<Satisfaction[]> {
        const result = await this.createQueryBuilder('p')
            .select([
                'p.product_category AS target',
                'p.introduceTextCategory AS introduceTextCategory',
                'COUNT(p.introduceTextCategory) AS introduceTextCategoryCount'
            ])
            .where('p.status = true')
            .groupBy('p.product_category, p.introduceTextCategory')
            .orderBy('introduceTextCategoryCount', 'DESC')
            .getRawMany();
        return result.map((data)=> Satisfaction.of(data.target, data.introduceTextCategory, data.introduceTextCategoryCount))    
    }



    /**
     * 카테고리별 선호 말투 조회 함수
     * @param userId 유저 id
     * @returns 
     */
    public async findMineCategorySatisfaction(userId:number): Promise<Satisfaction[]> {
        const result = await this.createQueryBuilder('p')
            .select([
                'p.product_category AS target',
                'p.introduceTextCategory AS introduceTextCategory',
                'COUNT(p.introduceTextCategory) AS introduceTextCategoryCount'
            ])
            .where('p.status = true')
            .andWhere('p.user_id = :userId',{userId})
            .groupBy('p.product_category, p.introduceTextCategory')
            .orderBy('introduceTextCategoryCount', 'DESC')
            .getRawMany();
        return result.map((data)=> Satisfaction.of(data.target, data.introduceTextCategory, data.introduceTextCategoryCount))    
    }
  

 }
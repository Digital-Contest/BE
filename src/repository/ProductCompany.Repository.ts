import { EntityRepository, Repository } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../entity/Product.js';
import { ProductCreate } from '../dto/request/ProductCreat.js';
import { User } from '../entity/User.js';
import { ProductCompany } from '../entity/ProductCompany.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




@EntityRepository(ProductCompany)
export class ProductCompanyRepository extends Repository<ProductCompany> {

   /**
    * 물품 등록 회사 삽입
    * @param company 등록할 회사들
    * @param productId 물품 id
    * @returns 
    */
   public async insertProductCompanys(company:string[], productId: number){
      const newProductCompanys = company.map((data)=> ProductCompany.createProductCompany(data, productId));
      return this.save(newProductCompanys);
   }


 }
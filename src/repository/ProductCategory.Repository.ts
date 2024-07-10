import { EntityRepository, Repository } from "typeorm";
import { ProductCategory } from "../entity/ProductCategory.js";



@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends Repository<ProductCategory> {


    public findCategoryByName(name:string):Promise<ProductCategory>{
        return this.createQueryBuilder()
            .select('c')
            .from(ProductCategory, 'c')
            .where('c.name = :name',{name})
            .getOne();
    }





 
}
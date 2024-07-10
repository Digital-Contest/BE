import { EntityRepository, Repository } from "typeorm";
import { IntroduceTextCategory } from "../entity/IntroduceTextCategory.js";



@EntityRepository(IntroduceTextCategory)
export class IntroduceTextCategoryRepository extends Repository<IntroduceTextCategory> {


    public async findIntroduceTextCategoryByName(name:string):Promise<IntroduceTextCategory>{
        return this.createQueryBuilder()
            .select('c')
            .from(IntroduceTextCategory, 'c')
            .where('c.name = :name',{name})
            .getOne();
    }





 
}
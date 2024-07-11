
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.Repository.js";
import { getProductCategoryByCondition } from "../util/enum/ProductCategory.js";
import { Product } from "../entity/Product.js";



@Service()
export class UserService{
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) { }






    public async modifyUserScoreAccordingToProductStatus(status:boolean, product:Product, userId:number){
        if(status){
            const productCategoryScore = getProductCategoryByCondition(product.getProductCategory());
            await this.userRepository.updateUserScore(userId, productCategoryScore)
        }
        return;
    }

     

}

import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.Repository";
import { getProductCategoryByCondition } from "../util/enum/ProductCategory";
import { Product } from "../entity/Product";
import { UserNickname } from "../dto/response/UserNickname";



@Service()
export class UserService{
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) { }

    /**
     * 유저 닉네임 조회 함수
     * @param userId 유저 id
     * @returns 
     */
    async bringNickname(userId:number) {
        const userData = await this.userRepository.findUserById(userId);
        return UserNickname.of(userData.getNickname());
    }



    public async modifyUserScoreAccordingToProductStatus(status:boolean, product:Product, userId:number){
        if(status){
            const productCategoryScore = getProductCategoryByCondition(product.getProductCategory());
            await this.userRepository.updateUserScore(userId, productCategoryScore)
        }
        return;
    }

     

}
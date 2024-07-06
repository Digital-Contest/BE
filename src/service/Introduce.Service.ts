import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CategoryRepository } from "../repository/Category.Repository";
import { Category } from "../entity/Category";
import { checkData } from "../util/checker";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { ErrorCode } from "../exception/ErrorCode";

@Service()
export class IntroduceService{


    constructor(
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
    ) {}


    public async makeIntroduceText(image:File[], category:string, price:number, product:string): Promise<string> {
        const categoryData = await this.categoryRepository.findCategoryByName(category);
        this.verifyCategory(categoryData);

        return ;
   
    }




    private verifyCategory(categoryData: Category){
        if(!checkData(categoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_CATEGORY);
        }
    }


}
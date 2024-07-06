import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CategoryRepository } from "../repository/Category.Repository";
import { Category } from "../entity/Category";
import { checkData } from "../util/checker";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { ErrorCode } from "../exception/ErrorCode";
import { uploadImage } from "../util/s3Upload.js";

@Service()
export class IntroduceService{


    constructor(
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
    ) {}


    public async makeIntroduceText(images: string[], category:string, price:number, product:string): Promise<string> {
        const categoryData = await this.categoryRepository.findCategoryByName(category);
        this.verifyCategory(categoryData);
        console.log(images)
        console.log(category)
        return;
   
    }




    private verifyCategory(categoryData: Category){
        if(!checkData(categoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_CATEGORY);
        }
    }


}
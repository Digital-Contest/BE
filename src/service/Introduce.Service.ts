import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { checkData } from "../util/checker.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { ErrorCode } from "../exception/ErrorCode.js";
import { IntroduceTextCategory } from "../entity/IntroduceTextCategory.js";
import { IntroduceTextCategoryRepository } from "../repository/IntroduceTextCategoryData.Repository.js";

@Service()
export class IntroduceService{


    constructor(
        @InjectRepository(IntroduceTextCategory) private readonly introduceTextCategory: IntroduceTextCategoryRepository,
    ) {}


    public async makeIntroduceText(images: string[], category:string, price:number, product:string): Promise<string> {
        const introduceTextCategoryData = await this.introduceTextCategory.findIntroduceTextCategoryByName(category);
        this. verifyIntroduceTextCategory(introduceTextCategoryData);
        console.log(images)
        console.log(category)
        return;
   
    }




    private verifyIntroduceTextCategory(introduceTextCategoryData: IntroduceTextCategory){
        if(!checkData(introduceTextCategoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_CATEGORY);
        }
    }


}
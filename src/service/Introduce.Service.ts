import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
//import { CategoryRepository } from "../repository/Category.Repository.js";
import { checkData } from "../util/checker.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { ErrorCode } from "../exception/ErrorCode.js";
import { uploadImage } from "../util/s3Upload.js";
import { ProductCategoryRepository } from "../repository/ProductCategory.Repository.js";
import { ProductCategory } from "../entity/ProductCategory.js";

@Service()
export class IntroduceService{


    constructor(
        @InjectRepository(ProductCategoryRepository) private readonly productCategoryRepository: ProductCategoryRepository,
    ) {}


    public async makeIntroduceText(images: string[], category:string, price:number, product:string): Promise<string> {
        const productCategoryData = await this.productCategoryRepository.findCategoryByName(category);
        this.verifyCategory(productCategoryData);
        console.log(images)
        console.log(category)
        return;
   
    }




    private verifyCategory(productCategoryData: ProductCategory){
        if(!checkData(productCategoryData)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_CATEGORY);
        }
    }


}
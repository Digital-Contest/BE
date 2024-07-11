import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '../repository/Product.Repository.js';
import { UserService } from './User.Service.js';
import { Product } from '../entity/Product.js';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';
import { ProductList } from '../dto/response/ProductList.js';
import { parseRoutes } from 'routing-controllers-openapi';
import { formatDate } from '../util/date.js';





@Service()
export class ProductService {

    constructor(
        @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
        private readonly userService: UserService
    ) {}

    /**
     * 판매 물품 상태 처리 함수
     * @param userId 유저 id
     * @param productId 물품 id
     */
    async modifyProductStatus(userId:number, productId: number, status: boolean):Promise<void> {
        const productData = await this.productRepository.findProductById(productId);
        this.verfiyProduct(productData);
        await this.productRepository.updateProductStatus(userId, productId, status);
        await this.userService.modifyUserScoreAccordingToProductStatus(status, productData, userId);
     
    }

    /**
     * 상태에 따른 물품 조회 함수
     * @param userId 유저 id
     * @param status 조회할 상품 상태
     * @returns 물품 정보
     */
    async bringMyProduct(userId:number, status:string):Promise<ProductList[]>{
        const productDatas = await this.productRepository.findProductAndProductCompanyByUserIdAndStatus(userId, this.changeType(status));
        return this.mappingMyProductData(productDatas);
    }

    /**
     * product의 데이터 유무에 따라 예외처리 함수
     * @param productData product 엔티티 데이터
     */
    private verfiyProduct(productData:Product){
        if (!checkData(productData)) {
           throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT);
        }
    }

    private mappingMyProductData(products: Product[]){
        return products.map((data)=> {
            return new ProductList(data.getId(), data.getProduct(), data.getProductCategory(), 
            data.getImageUrl(), formatDate(data.getCreatedAt()), 
            data.getProductCompanys().map((data)=> data.getCompany()))
        })
    }


    /**
     * 데이터 타입을 변환해주는 함수
     * @param variable 변환할 변수
     * @returns 변환된 변수
     */
    private changeType(variable:string): boolean | null{
        let result : boolean | null;
        if (variable === "true") {
            result = true;
        } else if (variable === "false") {
            result = false;
        } else {
            result = null;
        }
        return result;
    

    }

    







}

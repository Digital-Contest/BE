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
import { ProductCreate } from '../dto/request/ProductCreat.js';
import { UserRepository } from '../repository/User.Repository.js';
import { ProductCompanyRepository } from '../repository/ProductCompany.Repository.js';
import { Transactional } from '../util/decorator/transaction.js';
import { Connection } from 'typeorm';
import { verifyIntroduceTextCategory, verifyProductCategory } from '../util/verify.js';
import { getIntroduceTextCategoryByCondition } from '../util/enum/IntroduceTextCategory.js';
import { getProductCategoryByCondition } from '../util/enum/ProductCategory.js';





@Service()
export class ProductService {

    constructor(
        @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
        private readonly userService: UserService,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(ProductCompanyRepository) private readonly productCompanyRepository: ProductCompanyRepository,
        private readonly connection: Connection,
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
     * Product 생성
     * @param userId 유저 id
     * @param imageUrl 상품 이미지
     * @param productCreate 상품 정보
     */
    @Transactional()
    async pentrateProduct(userId:number, imageUrl:string, introduceCategory:string, price:number, productCategory:string,
        product:string, introduceText:string, companys:string[]){
        verifyIntroduceTextCategory(getIntroduceTextCategoryByCondition(introduceCategory));
        verifyProductCategory(getProductCategoryByCondition(productCategory));
        const productData = await this.productRepository.insertProduct(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText);
        await this.pentrateProductCompany(companys, productData.getId());
    }

    /**
     * 물품 등록 회사를 삽입하는 함수
     * @param company 등록할 회사들
     * @param productId 물품 id
     */
    async pentrateProductCompany(company:string[], productId:number){
        await this.productCompanyRepository.insertProductCompanys(company, productId);
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

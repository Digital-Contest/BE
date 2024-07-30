import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '../repository/Product.Repository';
import { UserService } from './User.Service';
import { Product } from '../entity/Product';
import { ProductList } from '../dto/response/ProductList';
import { formatDate } from '../util/date';
import { UserRepository } from '../repository/User.Repository';
import { ProductCompanyRepository } from '../repository/ProductCompany.Repository';
import { Transactional } from '../util/decorator/transaction';
import { Connection } from 'typeorm';
import { verfiyProduct, verifyIntroduceTextCategory, verifyProductCategory } from '../util/verify';
import { getIntroduceTextCategoryByCondition } from '../util/enum/IntroduceTextCategory';
import { getProductCategoryByCondition } from '../util/enum/ProductCategory';





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
        verfiyProduct(productData);
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
        await this.productCompanyRepository.insertProductCompanys(companys, productData.getId());
    }



    private mappingMyProductData(products: Product[]){
        return products.map((data)=> {
            return new ProductList(data.getId(), data.getProduct(), data.getProductCategory(), 
            data.getImageUrl(), formatDate(data.getCreatedAt()), 
            data.getProductCompanys().map((data)=> data.getCompany()), data.getPrice());
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

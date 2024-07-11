import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '../repository/Product.Repository.js';
import { UserService } from './User.Service.js';
import { Product } from '../entity/Product.js';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';





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
     * product의 데이터 유무에 따라 예외처리 함수
     * @param productData product 엔티티 데이터
     */
    private verfiyProduct(productData:Product){
        if (!checkData(productData)) {
           throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_PRODUCT);
        }
    }

    







}

import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ErrorResponseDto } from '../response/ErrorResponseDto';
import { ErrorCode } from '../exception/ErrorCode';
import { ProductRepository } from '../repository/Product.Repository';
import { CompanySatisfaction } from '../dto/response/CompanySatisfaction';



@Service()
export class SatisfactionService {

    constructor(
        @InjectRepository(ProductRepository) private productRepository: ProductRepository,
    ) {}


    /**
     * 전체 or 나의 플랫폼별 선호 말투 조회 함수
     * @param userId 유저 id
     * @param kind 종류 whole -> 전체, mine -> 나의
     * @returns 
     */
    async bringProductSatisfation(userId:number, kind:string) {
        const companySatisfaction = await this.bringCompanySatisfactionAccordingToKind(userId, kind);
        return this.extractMostIntroduceCategory(companySatisfaction);
    }


    /**
     * 
     * @param companySatisfaction 플랫폼별 선호 말투 중 가장 인기 있는 말투를 선별하는 함수
     * @returns 
     */
    public extractMostIntroduceCategory(companySatisfaction:CompanySatisfaction[]){ 
        const result = companySatisfaction.reduce((acc, current) => {
            const existing = acc.find(item => item.getCompany() === current.getCompany());
            if (!existing || existing.introduceTextCategoryCount < current.getIntroduceTextCategoryCount()) {
                acc = acc.filter(item => item.getCompany() !== current.getCompany());
                acc.push(current);
            }
            return acc;
        }, []);
        return result;
    }


    /**
     * 종류에 따라 로직을 구분해주는 함수
     * @param userId 유저 id
     * @param kind 종류
     * @returns 
     */
    public async bringCompanySatisfactionAccordingToKind(userId:number, kind:string){
        switch(true){
            case kind === 'whole' :
                return this.productRepository.findWholeProductSatisfaction();
            case kind === 'mine':
                return this.productRepository.findMineProductSatisfaction(userId);
            default :
                throw ErrorResponseDto.of(ErrorCode.NOT_EXIST_KIND);
        }
    }






   

}

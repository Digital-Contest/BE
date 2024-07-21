import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ErrorResponseDto } from '../response/ErrorResponseDto';
import { ErrorCode } from '../exception/ErrorCode';
import { ProductRepository } from '../repository/Product.Repository';
import {  Satisfaction } from '../dto/response/Satisfaction';
import { getAllCompany } from '../util/enum/Company';
import { getAllIntroduceTextCategory } from '../util/enum/IntroduceTextCategory';
import { GroupedData } from '../interface/GroupData';
import { SatisfactionDetail, SatisfactionDetailData } from '../dto/response/SatisfactionDetail';
import { getAllProductCategory } from '../util/enum/ProductCategory';



@Service()
export class SatisfactionService {

    constructor(
        @InjectRepository(ProductRepository) private productRepository: ProductRepository,
    ) {}


    /**
     * 전체 or 나의 플랫폼별 선호 말투 조회 함수
     * @param userId 유저 id
     * @param kind 종류 platform-whole -> 전체, platform-mine -> 나의
     * @returns 
     */
    async bringPlatfromSatisfation(userId:number, kind:string) {
        const platformSatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind);
        return this.extractMostPlatform(platformSatisfaction);
    }


    /**
     * 전체 or 나의 카테고리별 선호 말투 조회 함수
     * @param userId 유저 id
     * @param kind 종류 category-whole -> 전체,  category-mine -> 나의
     * @returns 
     */
    async bringCategorySatisfation(userId:number, kind:string) {
         const categorySatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind);
         return this.extractMostCategory(categorySatisfaction);
    }


    /**
     * 전체 or 나의 플랫폼별 선호 말투 디테일 조회 함수
     * @param userId 유저id
     * @param kind 종류 platform-whole -> 전체, platform-mine -> 나의
     * @returns 
     */
    async bringPlatfromDetailSatisfation(userId:number, kind:string) {
        const platformSatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind);
        return this.mappingSatisfactionData(platformSatisfaction, getAllCompany());
    }


    /**
     * 전체 or 나의 카테고리별 선호 말투 디테일 조회 함수
     * @param userId 유저 id
     * @param kind 종류 category-whole -> 전체,  category-mine -> 나의 
     */
    async bringCategoryDetailSatisfation(userId:number, kind:string) {
        const categorySatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind);
        return this.mappingSatisfactionData(categorySatisfaction,  getAllProductCategory());
    }



    /**
     * 통계 데이터 매핑 함수
     * @param satisfaction 통계 데이터
     * @param criteria 기준 타켓
     * @returns 매핑된 데이터
     */
    public mappingSatisfactionData(satisfaction:Satisfaction[], criteria:string[]){
        const result: GroupedData = {};
        const groupedData = this.groupByTarget(satisfaction, result);
        const checkedGroupedData = this.checkExistence(criteria, getAllIntroduceTextCategory(), groupedData);
        return Object.values(checkedGroupedData).map(companyData =>
            SatisfactionDetail.of(companyData.target, companyData.data)
        );
    }


    /**
     * 존재 여부 체킹 후 데이터 처리 함수
     * @param allCompanies 회사
     * @param allCategories 제품 카테고리
     * @param groupedData 등록된 데이터
     * @returns 
     */
    public checkExistence(targets:string[], allCategories:string[], groupedData:GroupedData){
        targets.forEach(target => {
            if (!groupedData[target]) {
                groupedData[target] = {
                    target: target,
                    data: []};}
            const existingCategories = groupedData[target].data.map(d => d.getIntroduceTextCategory());
            allCategories.forEach(category => {
                if (!existingCategories.includes(category)) {
                    groupedData[target].data.push(
                        SatisfactionDetailData.of(category, 0));}
            });
        });
        return groupedData;
    }



    /**
     * 타켓을 기준으로 그룹화 진행
     * @param satisfaction 통계 데이터
     * @param groupedData 그룹 데이터 형식
     * @returns 그룹화된 데이터
     */
    public groupByTarget(satisfaction:Satisfaction[],groupedData:GroupedData){
        satisfaction.forEach(data => {
            const target = data.getTarget();
            if (!groupedData[target]) {
                groupedData[target] = {
                    target: target,
                    data: []
                };}
            groupedData[target].data.push(
                SatisfactionDetailData.of(data.getIntroduceTextCategory(), data.getIntroduceTextCategoryCount()));
        });
        return groupedData;
    }


    /**
     * 
     * @param platformSatisfaction 플랫폼별 선호 말투 중 가장 인기 있는 말투를 선별하는 함수
     * @returns 
     */
    public extractMostPlatform(platformSatisfaction:Satisfaction[]){ 
        const result = platformSatisfaction.reduce((acc, current) => {
            const existing = acc.find(item => item.getTarget() === current.getTarget());
            if (!existing || existing.introduceTextCategoryCount < current.getIntroduceTextCategoryCount()) {
                acc = acc.filter(item => item.getTarget() !== current.getTarget());
                acc.push(current);
            }
            return acc;
        }, []);
        return result;
    }


    /**
     * 
     * @param categorySatisfaction 카테고리별 선호 말투 중 가장 인기 있는 말투를 선별하는 함수
     * @returns 
     */
    public extractMostCategory(categorySatisfaction:Satisfaction[]){ 
        const result = categorySatisfaction.reduce((acc, current) => {
            const existing = acc.find(item => item.getTarget() === current.getTarget());
            if (!existing || existing.introduceTextCategoryCount < current.getIntroduceTextCategoryCount()) {
                acc = acc.filter(item => item.getTarget() !== current.getTarget());
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
    public async bringSatisfactionAccordingToKind(userId:number, kind:string){
        switch(true){
            case kind === 'platform-whole' :
                return this.productRepository.findWholePlatformSatisfaction();
            case kind === 'platform-mine':
                return this.productRepository.findMinePlatformSatisfaction(userId);
            case kind === 'category-whole':
                return this.productRepository.findWholeCategorySatisfaction();
            case kind === 'category-mine':
                return this.productRepository.findMineCategorySatisfaction(userId);  
            default :
                throw ErrorResponseDto.of(ErrorCode.NOT_EXIST_KIND);
        }
    }









   

}

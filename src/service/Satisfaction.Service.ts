import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ErrorResponseDto } from '../response/ErrorResponseDto';
import { ErrorCode } from '../exception/ErrorCode';
import { ProductRepository } from '../repository/Product.Repository';
import { PlatformSatisfaction } from '../dto/response/PlatformSatisfaction';
import { CategorySatisfaction } from '../dto/response/CategorySatisfaction';
import { PlatformDetail, PlatformDetailData } from '../dto/response/PlatformDetail';
import { getAllCompany } from '../util/enum/Company';
import { getAllIntroduceTextCategory } from '../util/enum/IntroduceTextCategory';
import { GroupedData } from '../interface/GroupedData';



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
        const platformSatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind) as PlatformSatisfaction[];
        return this.extractMostPlatform(platformSatisfaction);
    }


    /**
     * 전체 or 나의 카체고리별 선호 말투 조회 함수
     * @param userId 유저 id
     * @param kind 종류 category-whole -> 전체,  category-mine -> 나의
     * @returns 
     */
    async bringCategorySatisfation(userId:number, kind:string) {
         const categorySatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind) as CategorySatisfaction[];
         return this.extractMostCategory(categorySatisfaction);
    }


    async bringPlatfromDetailSatisfation(userId:number, kind:string) {
        const platformSatisfaction = await this.bringSatisfactionAccordingToKind(userId, kind) as PlatformSatisfaction[];
        return this.mappingPlatformDetailData(platformSatisfaction);
    }



    public groupByCompany(platformSatisfaction:PlatformSatisfaction[],groupedData:GroupedData ){
        platformSatisfaction.forEach(data => {
            const company = data.getCompany();
            if (!groupedData[company]) {
                groupedData[company] = {
                    company: company,
                    data: []
                };
            }
            groupedData[company].data.push(
                PlatformDetailData.of(data.getIntroduceTextCategory(), data.getIntroduceTextCategoryCount())
            );
        });

        return groupedData;
    }

    public mappingPlatformDetailData(platformSatisfaction:PlatformSatisfaction[]){
        // const groupedData: { [key: string]: { company: string; data: PlatformDetailData[] } } = {};
        // platformSatisfaction.forEach(data => {
        //     if (!groupedData[data.getCompany()]) {
        //         groupedData[data.getCompany()] = {
        //             company: data.getCompany(),
        //             data: []
        //         };}
        //     groupedData[data.getCompany()].data.push(
        //         PlatformDetailData.of(data.getIntroduceTextCategory(), data.getIntroduceTextCategoryCount()));
        // });
        // return Object.values(groupedData).map(companyData => 
        //     PlatformDetail.of(companyData.company, companyData.data)
        // );
        const result: GroupedData = {};
        const groupedData = this.groupByCompany(platformSatisfaction, result);
        const checkedGroupedData = this.checkCompanyExistence(getAllCompany(), getAllIntroduceTextCategory(), groupedData);
        return Object.values(checkedGroupedData).map(companyData =>
            PlatformDetail.of(companyData.company, companyData.data)
        );
    }


    public checkCompanyExistence(allCompanies:string[], allCategories:string[], groupedData:GroupedData){
        allCompanies.forEach(company => {
            if (!groupedData[company]) {
                groupedData[company] = {
                    company: company,
                    data: []
                };
            }
            // Ensure all categories are included with count 0 if not present
            const existingCategories = groupedData[company].data.map(d => d.getIntroduceTextCategory());
            allCategories.forEach(category => {
                if (!existingCategories.includes(category)) {
                    groupedData[company].data.push(
                        PlatformDetailData.of(category, 0)
                    );
                }
            });
        });

        return groupedData;
    }

    // public checkCategoryExistence(allCategories:string[], groupedData:GroupedData){
    //     const existingCategories = groupedData[company].data.map(d => d.getIntroduceTextCategory());
    //     allCategories.forEach(category => {
    //         if (!existingCategories.includes(category)) {
    //             groupedData[company].data.push(
    //                 PlatformDetailData.of(category, 0)
    //             );
    //         }
    //     });
    // }







    /**
     * 
     * @param platformSatisfaction 플랫폼별 선호 말투 중 가장 인기 있는 말투를 선별하는 함수
     * @returns 
     */
    public extractMostPlatform(platformSatisfaction:PlatformSatisfaction[]){ 
        const result = platformSatisfaction.reduce((acc, current) => {
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
     * 
     * @param categorySatisfaction 카테고리별 선호 말투 중 가장 인기 있는 말투를 선별하는 함수
     * @returns 
     */
    public extractMostCategory(categorySatisfaction:CategorySatisfaction[]){ 
        const result = categorySatisfaction.reduce((acc, current) => {
            const existing = acc.find(item => item.getCategory() === current.getCategory());
            if (!existing || existing.introduceTextCategoryCount < current.getIntroduceTextCategoryCount()) {
                acc = acc.filter(item => item.getCategory() !== current.getCategory());
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

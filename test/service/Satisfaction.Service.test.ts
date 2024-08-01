import { link } from 'fs';
import { Satisfaction } from '../../src/dto/response/Satisfaction';
import {ProductRepository} from '../../src/repository/Product.Repository';
import {SatisfactionService} from '../../src/service/Satisfaction.Service';
import { SatisfactionDetail, SatisfactionDetailData } from '../../src/dto/response/SatisfactionDetail';
import {getAllCompany} from '../../src/util/enum/Company';
import {getAllProductCategory} from '../../src/util/enum/ProductCategory';
import { ErrorCode } from '../../src/exception/ErrorCode';
import { ErrorResponseDto } from '../../src/response/ErrorResponseDto';
import { GroupedData } from '../../src/interface/GroupData';
import exp from 'constants';

jest.mock('../../src/repository/Product.Repository')
jest.mock('../../src/util/enum/Company', ()=>({
    getAllCompany: jest.fn()
}))
jest.mock('../../src/util/enum/ProductCategory', ()=>({
    getAllProductCategory: jest.fn()
}))


describe('Satisfaction Service 테스트', ()=>{

    const mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    const mockGetAllCompany = getAllCompany as jest.Mock;
    const mockGetAllProductCategory = getAllProductCategory as jest.Mock;
    let satisfactionService : SatisfactionService;
    beforeEach(() => {
        satisfactionService = new SatisfactionService(mockProductRepository);
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    const userId = 1;
    const kind = 'mock-kind';
    const mockSatisfactionData: Satisfaction[] = [
        Satisfaction.of('target2', 'category2', 20),
        Satisfaction.of('target1', 'category1', 15) 
    ];
    const bringSatisfationResponse : Satisfaction[] = [
        Satisfaction.of('target2', 'category2', 20),
        Satisfaction.of('target1', 'category1', 15)
    ];
    const mappingSatisfactionDataResponse: SatisfactionDetail[] = [
        SatisfactionDetail.of('target2', [
            SatisfactionDetailData.of('category2', 20)
        ]),
        SatisfactionDetail.of('target1', [
            SatisfactionDetailData.of('category1', 15)
        ])
    ];

    describe('bringPlatfromSatisfation 함수', ()=>{
        it('bringPlatfromSatisfation 정상 처리', async()=>{
            const bringSatisfactionAccordingToKind = jest.spyOn(satisfactionService as any, "bringSatisfactionAccordingToKind").mockResolvedValue(mockSatisfactionData);
            const extractMostPlatform = jest.spyOn(satisfactionService as any, "extractMostPlatform").mockReturnValue(bringSatisfationResponse);
            const result = await satisfactionService.bringPlatfromSatisfation(userId, kind);
            expect(result).toEqual(bringSatisfationResponse);
            expect(bringSatisfactionAccordingToKind).toHaveBeenCalledWith(userId, kind);
            expect(extractMostPlatform).toHaveBeenCalledWith(mockSatisfactionData); 
        });
    });


    describe('bringCategorySatisfation 함수', ()=>{
        it('bringCategorySatisfation 정상 처리', async()=>{
            const bringSatisfactionAccordingToKind = jest.spyOn(satisfactionService as any, "bringSatisfactionAccordingToKind").mockResolvedValue(mockSatisfactionData);
            const extractMostCategory = jest.spyOn(satisfactionService as any, "extractMostCategory").mockReturnValue(bringSatisfationResponse);
            const result = await satisfactionService.bringCategorySatisfation(userId, kind); 
            expect(result).toEqual(bringSatisfationResponse);
            expect(bringSatisfactionAccordingToKind).toHaveBeenCalledWith(userId, kind);
            expect(extractMostCategory).toHaveBeenCalledWith(mockSatisfactionData); 
        });
    });


    describe('bringPlatfromDetailSatisfation 함수', ()=>{
        it('bringPlatfromDetailSatisfation 정상 처리', async()=>{
            const bringSatisfactionAccordingToKind = jest.spyOn(satisfactionService as any, "bringSatisfactionAccordingToKind").mockResolvedValue(mockSatisfactionData);
            const mappingSatisfactionData = jest.spyOn(satisfactionService as any, 'mappingSatisfactionData').mockReturnValue(mappingSatisfactionDataResponse);
            const getAllCompany = mockGetAllCompany.mockReturnValue(['company1','company2','company3'])
            const result = await satisfactionService.bringPlatfromDetailSatisfation(userId, kind);   
            expect(result).toEqual(mappingSatisfactionDataResponse);
            expect(bringSatisfactionAccordingToKind).toHaveBeenCalledWith(userId, kind);
            expect(mappingSatisfactionData).toHaveBeenCalledWith(mockSatisfactionData, ['company1','company2','company3']);
            expect(getAllCompany).toHaveBeenCalled();
         
        });
    });


    describe('bringCategoryDetailSatisfation 함수', ()=>{
        it('bringCategoryDetailSatisfation 정상 처리', async()=>{
            const bringSatisfactionAccordingToKind = jest.spyOn(satisfactionService as any, "bringSatisfactionAccordingToKind").mockResolvedValue(mockSatisfactionData);
            const mappingSatisfactionData = jest.spyOn(satisfactionService as any, 'mappingSatisfactionData').mockReturnValue(mappingSatisfactionDataResponse);
            const getAllProductCategory = mockGetAllProductCategory.mockReturnValue(['productCategory1','productCategory2','productCategory3'])
            const result = await satisfactionService.bringCategoryDetailSatisfation(userId, kind);
            expect(result).toEqual(mappingSatisfactionDataResponse);
            expect(bringSatisfactionAccordingToKind).toHaveBeenCalledWith(userId, kind);
            expect(mappingSatisfactionData).toHaveBeenCalledWith(mockSatisfactionData, ['productCategory1','productCategory2','productCategory3']);
            expect(getAllProductCategory).toHaveBeenCalled();
         
        });
    });

    describe('bringSatisfactionAccordingToKind 함수', () => {
        const mockData = [] as unknown as Satisfaction[]

        it('유효한 kind 값 platform-whole 호출 확인', async () => {
            const validKind = 'platform-whole'; // 유효한 kind
            jest.spyOn(mockProductRepository, 'findWholePlatformSatisfaction').mockResolvedValue(mockData);
            const result = await satisfactionService['bringSatisfactionAccordingToKind'](userId, validKind);
            expect(result).toEqual(mockData);
        });

        it('유효한 kind 값 platform-mine 호출 확인', async () => {
            const validKind = 'platform-mine'; // 유효한 kind
            jest.spyOn(mockProductRepository, 'findMinePlatformSatisfaction').mockResolvedValue(mockData);
            const result = await satisfactionService['bringSatisfactionAccordingToKind'](userId, validKind);
            expect(result).toEqual(mockData);
        });

        it('유효한 kind 값 category-whole 호출 확인', async () => {
            const validKind = 'category-whole'; // 유효한 kind
            jest.spyOn(mockProductRepository, 'findWholeCategorySatisfaction').mockResolvedValue(mockData);
            const result = await satisfactionService['bringSatisfactionAccordingToKind'](userId, validKind);
            expect(result).toEqual(mockData);
        });

        it('유효한 kind 값 category-mine 호출 확인', async () => {
            const validKind = 'category-mine'; // 유효한 kind
            jest.spyOn(mockProductRepository, 'findMineCategorySatisfaction').mockResolvedValue(mockData);
            const result = await satisfactionService['bringSatisfactionAccordingToKind'](userId, validKind);
            expect(result).toEqual(mockData);
        });

        it('유효하지 않은 kind 값에 대해 예외 처리 확인', async () => {
            const invalidKind = 'invalid-kind'; // 유효하지 않은 kind
            await expect(satisfactionService['bringSatisfactionAccordingToKind'](userId, invalidKind))
                .rejects
                .toEqual(ErrorResponseDto.of(ErrorCode.NOT_EXIST_KIND));
        });
    });

    const groupData:GroupedData = {}
    const groupedData: GroupedData = {
        target2: {
            target: 'target2',
            data: [
                SatisfactionDetailData.of('category2', 20)
            ],
        },
        target1: {
            target: 'target1',
            data: [
                SatisfactionDetailData.of('category1', 15)
            ],
        }
    };

    const allCategories = ["궁서체", "둥글둥글체", "단호박체", "성냥팔이체", "귀욤체", "요점만체"];
    const criteria = ['category1', 'category2'];
    describe('mappingSatisfactionData 함수', () => {
        it('mappingSatisfactionData 정상처리', () => {
            const groupByTarget = jest.spyOn(satisfactionService as any, 'groupByTarget').mockReturnValue(groupedData);
            const checkExistence = jest.spyOn(satisfactionService as any, 'checkExistence').mockReturnValue(groupedData);
            const result = satisfactionService['mappingSatisfactionData'](mockSatisfactionData, criteria);
            expect(result).toEqual(mappingSatisfactionDataResponse);
            expect(groupByTarget).toHaveBeenCalledWith(mockSatisfactionData, groupData);
            expect(checkExistence).toHaveBeenCalledWith(criteria, allCategories, groupedData )
        });
    });

    describe('checkExistence 함수', () => {
        it('checkExistence 정상처리', () => {
            const result = satisfactionService['checkExistence'](criteria, allCategories, groupedData);
            expect(result).toEqual(groupedData);
        });
    });

    const groupByTargetGroupedData: GroupedData = {
        target1: {
            target: 'target1',
            data: [
                SatisfactionDetailData.of('category1', 15) 
            ],
        },
        target2: {
            target: 'target2',
            data: [
                SatisfactionDetailData.of('category2', 20) 
            ],
        }
    };
    describe('groupByTarget 함수', () => {
        it('groupByTarget 정상처리', () => {
            const result = satisfactionService['groupByTarget'](mockSatisfactionData, groupData);
            expect(result).toEqual(groupByTargetGroupedData);
        });
    });


    describe('extractMostPlatform 함수', () => {
        it('extractMostPlatform 정상처리', () => {
            const result = satisfactionService['extractMostPlatform'](mockSatisfactionData);
            expect(result).toEqual(mockSatisfactionData);
        });
    });


    describe('extractMostCategory 함수', () => {
        it('extractMostCategory 정상처리', () => {
            const result = satisfactionService['extractMostCategory'](mockSatisfactionData);
            expect(result).toEqual(mockSatisfactionData);
        });
    });




});
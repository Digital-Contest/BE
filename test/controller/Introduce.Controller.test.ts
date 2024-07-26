import { IntroduceService } from '../../src/service/Introduce.Service';
import { IntroduceController } from '../../src/controller/Introduce.Controller';
import { IntroduceTextResponse } from '../../src/dto/response/IntroduceTextResponse';
import { IntroduceTextRequest } from '../../src/dto/request/IntruduceTextRequest';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';

jest.mock('../../src/service/Introduce.Service');


describe('Introduce Controller 테스트',()=>{

    const mockIntroduceService = new IntroduceService()as jest.Mocked<IntroduceService>;

    const introduceController = new IntroduceController(mockIntroduceService);


    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /introduce/text', ()=>{

        it('소개 글 생성', async()=>{

            const introduceText = new IntroduceTextRequest();
            introduceText.getIntroduceCategory = jest.fn().mockReturnValue('mock-category');
            introduceText.getPrice = jest.fn().mockReturnValue(1000);
            introduceText.getProduct = jest.fn().mockReturnValue('mock-product');
            introduceText.getProductCategory = jest.fn().mockReturnValue('mock-productCategory');

            const req : any = {
                files:[
                    {location: 'image1.jpg'},
                    {location: 'image2.jpg'}
                ]
            }

            const makeIntroduceTextResponse = IntroduceTextResponse.of('mock-introduceText', 100000);
            mockIntroduceService.makeIntroduceText.mockResolvedValue(makeIntroduceTextResponse);


            const result = await introduceController.makeIntroduceText(introduceText, req);
            expect(mockIntroduceService.makeIntroduceText).toHaveBeenCalledWith(
                ['image1.jpg', 'image2.jpg'],
                'mock-category',
                1000,
                'mock-productCategory',
                'mock-product'
            );

            expect(result).toEqual(SuccessResponseDto.of(makeIntroduceTextResponse));







        })
    })
})
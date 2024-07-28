
import { Request, Response } from 'express';
import { ProductStatus } from '../../src/dto/request/ProductStatus';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import {UserService} from '../../src/service/User.Service';
import {UserController} from '../../src/controller/User.Controller';
import { UserNickname } from '../../src/dto/response/UserNickname';



declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { user_id: number };
    }
}

jest.mock('../../src/service/User.Service')

const mockUserService = new UserService({} as any) as jest.Mocked<UserService>;

const userController = new UserController(mockUserService);



describe('User Controller test', ()=>{

    beforeEach(() => {
        jest.clearAllMocks();
      });
    

    describe('GET /user/nickname', ()=>{

        it('bringNickname 함수', async()=>{
            
            const req = {decoded:{user_id:1}} as Request;

            const bringNicknameResponse = UserNickname.of('mock-nickname');

            mockUserService.bringNickname.mockResolvedValue(bringNicknameResponse);

            const result = await userController.bringNickname(req);

            expect(result).toEqual(SuccessResponseDto.of(bringNicknameResponse));
            expect(mockUserService.bringNickname).toHaveBeenCalledWith(req.decoded?.user_id);
        });
    });


 

});
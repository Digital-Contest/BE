import { Request } from "express";
import {extractAuthToken, getAuthTokenBody} from '../../src/middleware/jwtMiddleware';
import jwt from 'jsonwebtoken';

//jest.mock('../../src/middleware/jwtMiddleware')
jest.mock('jsonwebtoken')
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('jwtMiddleware 테스트', () => {
  //  let mockExtractAuthToken : jest.Mock;

    beforeEach(() => {
     //   mockExtractAuthToken = extractAuthToken as jest.Mock;
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('extractAuthToken 함수', () => {
        it('extractAuthToken 정상 테스트', () => {
            const req = {headers:{authorization:"Bearer token"}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual("token");
        });

        it('extractAuthToken 토큰 Bearer 형식 에러 테스트', () => {
            const req = {headers:{authorization:"Bear token"}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual(undefined);
        });

        it('extractAuthToken req.headers.authorization 에러 테스트', () => {
            const req = {headers:{}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual(undefined);
        });
   
    });



    describe('getAuthTokenBody 함수', () => {
        const req = {headers:{authorization:"Bearer token"}} as Request;
   
        it('getAuthTokenBody 정상 테스트1', () => {
            const payload = '{ "key": "value" }';
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue(JSON.parse(payload));
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toEqual(JSON.parse(payload))
            expect(mockJwt.verify).toHaveBeenCalledWith("token","secret");
        });

        it('getAuthTokenBody 정상 테스트2', () => {
            const payload = { "key": "value" };
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue(payload);
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toEqual(payload)
            expect(mockJwt.verify).toHaveBeenCalledWith("token","secret");
        });

        it('getAuthTokenBody 에러 테스트', () => {
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue('{ invalid_json }');
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toBeUndefined();
            expect(mockJwt.verify).toHaveBeenCalledWith('token', 'secret')
        });
   });

    // describe('signVerifyAccessToken 함수', () => {

    //     it('signVerifyAccessToken 정상 테스트', () => {
    //         const status = true
    //         expect(() => signVerifyAccessToken(status)).toThrow();

    //     });
      
    // });

    // describe('signVerifyRefreshToken 함수', () => {
    //     it('signVerifyRefreshToken 정상 테스트', () => {
    //         const status = false
    //         expect(() => signVerifyRefreshToken(status)).toThrow();
    //     });
    
    // });
});
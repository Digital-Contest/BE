import {JwtManager} from '../../src/util/JwtManager';
import { TokenManager } from '../../src/util/TokenManager';
import jwt from 'jsonwebtoken';

jest.mock('../../src/util/TokenManager')
jest.mock('jsonwebtoken')
const mockJwt = jwt as jest.Mocked<typeof jwt>;



describe('JwtManager 테스트', () => {

    let jwtManager:JwtManager;
    const mockTokenManager = new TokenManager() as jest.Mocked<TokenManager>;
    beforeEach(()=>{
        jwtManager = new JwtManager(mockTokenManager);
        jest.clearAllMocks()
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('makeAccessToken 함수 테스트', () => {
        const userId = 1;
        const userRole = "USER";
                    const payload = {
                user_id:userId,
                role:userRole
            }
        it('makeAccessToken 함수 정상 처리', () => {
            (mockJwt.sign as jest.Mock).mockReturnValue("mock-token");
            const result =  jwtManager.makeAccessToken(userId, userRole);
            expect(result).toEqual('Bearer mock-token');
            expect(mockJwt.sign).toHaveBeenCalledWith(payload, 'secret', {
                algorithm: 'HS256',
                expiresIn: '30d',
            });
        });
    });

    describe('makeRefreshToken 함수 테스트', () => {
        it('makeRefreshToken 함수 정상 처리', () => {
            (mockJwt.sign as jest.Mock).mockReturnValue("mock-token");
            const result =  jwtManager.makeRefreshToken();
            expect(result).toEqual('Bearer mock-token');
            expect(mockJwt.sign).toHaveBeenCalledWith({}, 'secret', {
                algorithm: 'HS256',
                expiresIn: '60d',
            });
        });
    });

    describe('decode 함수 테스트', () => {
        const token = 'mock-token';
        const decodeResponse = {
            user_id: 1,
            role: "USER"
        }
        it('decode 함수 정상 처리', () => {
            (mockJwt.decode as jest.Mock).mockReturnValue(decodeResponse);
            const result =  jwtManager.decode(token);
            expect(result).toEqual({
                message: "Ok",
                userId: decodeResponse.user_id,
                role: decodeResponse.role,
            });
            expect(mockJwt.decode).toHaveBeenCalledWith(token);
        });

        it('decode 에러 처리', () => {
            (mockJwt.decode as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });
            const result = jwtManager.decode(token);
            expect(result).toBeUndefined();
            expect(mockJwt.decode).toHaveBeenCalledWith(token);
        });
    });


    describe('verify 함수 테스트', () => {
        const token = 'mock-token';
        const verifyResponse = {
            user_id: 1,
            role: "USER"
        }
        it('verify 함수 정상 처리', () => {
            (mockJwt.verify as jest.Mock).mockReturnValue(verifyResponse);
            const result =  jwtManager.verify(token);
            expect(result).toEqual({
                state:true,
                userId:verifyResponse.user_id,
                role:verifyResponse.role,
            });
            expect(mockJwt.verify).toHaveBeenCalledWith(token, 'secret');
        });

        it('verify 에러 처리', () => {
            (mockJwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });
            const result = jwtManager.verify(token);
            expect(result).toEqual({state:false})
            expect(mockJwt.verify).toHaveBeenCalledWith(token, 'secret');
        });
    });


    describe('refreshVerify 함수 테스트', () => {
        const userId = 1;
        const requestToken = 'Bearer validToken';
        const responseToken = 'validToken';
        const refreshVerifyResponse = {
            state: true, token: responseToken 
        }
        const refreshVerifyError = {
            state: false
        }
        it('refreshVerify 함수 정상 처리', async () => {
            mockTokenManager.getToken.mockResolvedValue(responseToken);
            const verifyToken = jest.spyOn(jwtManager as any, "verifyToken").mockReturnValue(true)
            const result = await jwtManager.refreshVerify(requestToken, userId);
            expect(result).toEqual(refreshVerifyResponse);
            expect(mockTokenManager.getToken).toHaveBeenCalledWith(userId+"eco");
            expect(verifyToken).toHaveBeenCalledWith(requestToken, responseToken)
            expect(jwt.verify).toHaveBeenCalledWith(requestToken.split('Bearer ')[1],'secret')
        });

        it('refreshVerify 토큰 검증 에러 처리', async () => {
            mockTokenManager.getToken.mockResolvedValue(responseToken);
            const verifyToken = jest.spyOn(jwtManager as any, "verifyToken").mockReturnValue(false)
            const result = await jwtManager.refreshVerify(requestToken, userId);
            expect(result).toEqual(refreshVerifyError);
            expect(mockTokenManager.getToken).toHaveBeenCalledWith(userId+"eco");
            expect(verifyToken).toHaveBeenCalledWith(requestToken, responseToken)
            expect(jwt.verify).not.toHaveBeenCalled()
        });

        it('refreshVerify 에러 처리', async () => {
            mockTokenManager.getToken.mockResolvedValue(responseToken);
            const verifyToken = jest.spyOn(jwtManager as any, "verifyToken").mockReturnValue(true);
            (mockJwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });
            const result = await jwtManager.refreshVerify(requestToken, userId);
            expect(result).toEqual(refreshVerifyError);
            expect(mockTokenManager.getToken).toHaveBeenCalledWith(userId+"eco");
            expect(verifyToken).toHaveBeenCalledWith(requestToken, responseToken)
            expect(jwt.verify).toHaveBeenCalledWith(requestToken.split('Bearer ')[1],'secret')
        });


    });

    describe('verifyToken 함수 테스트', () => {
        it('verifyToken 함수 true 처리', () => {
            const externalToken = 'Bearer token';
            const internalToken = 'Bearer token';
            const result = jwtManager['verifyToken'](externalToken, internalToken);       
            expect(result).toEqual(true);
        });

        it('verifyToken 함수 false 처리', () => {
            const externalToken = 'Bearer token111';
            const internalToken = 'Bearer token222';
            const result = jwtManager['verifyToken'](externalToken, internalToken);       
            expect(result).toEqual(false);
        });
    });
});
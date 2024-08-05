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
            (mockJwt.decode as jest.Mock).mockReturnValue(decodeResponse);
            const result =  jwtManager.decode(token);
            expect(result).toEqual({
                message: "Ok",
                userId: decodeResponse.user_id,
                role: decodeResponse.role,
            });
            expect(mockJwt.decode).toHaveBeenCalledWith(token);
        });
    });




});

import { UserRepository } from "../../src/repository/User.Repository";
import { TokenManager } from "../../src/util/TokenManager";
import { JwtManager } from "../../src/util/JwtManager";
import { SocialLogin } from "../../src/util/SocialLogin";
import { AxiosResponse } from "axios";
import { User } from "../../src/entity/User";
import { AuthService } from "../../src/service/Auth.Service";
import { LoginResponse } from "../../src/dto/response/loginResponse";
import { Token } from "../../src/dto/response/Token";
import { checkData } from "../../src/util/checker"; 

jest.mock('../../src/repository/User.Repository');
jest.mock('../../src/util/TokenManager');
jest.mock('../../src/util/JwtManager');
jest.mock('../../src/util/SocialLogin');
jest.mock('../../src/util/checker');

const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
const mockTokenManager = new TokenManager() as jest.Mocked<TokenManager>;
const mockJwtManager = new JwtManager( {} as any ) as jest.Mocked<JwtManager>;
const mockSocialLogin = new SocialLogin() as jest.Mocked<SocialLogin>;

const authService = new AuthService(
    mockUserRepository,
    mockJwtManager,
    mockTokenManager,
    mockSocialLogin
);

const mockUser = {
    getId: jest.fn().mockReturnValue(2),
    getRole: jest.fn().mockReturnValue('user'),
} as unknown as User;

describe('Auth Service 테스트 코드', () => {
    beforeEach(()=>{
        jest.clearAllMocks()
    });

    it('카카오 로그인 응용 함수', async () => {
        const kakaoToken = 'kakao-token';
        const kakaoData = {
            data: {
                id: 'kakaoUserId',
                kakao_account: { email: 'user@example.com' },
                properties: { nickname: 'Test User' }
            }
        } as AxiosResponse<any>;

        mockSocialLogin.getKakaoData.mockResolvedValue(kakaoData);
        mockUserRepository.findUserByKakaoId.mockResolvedValue(mockUser);
        mockJwtManager.makeAccessToken.mockReturnValue('mock-access-token');
        mockJwtManager.makeRefreshToken.mockReturnValue('mock-refresh-token');
        mockTokenManager.setToken.mockResolvedValue(undefined);

        (checkData as jest.Mock).mockReturnValue(false);
        const spySignInDependingOnRegistrationStatus = jest.spyOn(authService, 'signInDependingOnRegistrationStatus' as any);
        const spyInsertUser = jest.spyOn(mockUserRepository, 'insertUser');

        const mockLoginResponse: LoginResponse= LoginResponse.of('mock-access-token', 'mock-refresh-token', 'user');

        const result = await authService.kakaoLogin(kakaoToken);

        expect(result).toEqual(mockLoginResponse);
        expect(mockSocialLogin.getKakaoData).toHaveBeenCalledWith('kakao-token');
        expect(mockUserRepository.findUserByKakaoId).toHaveBeenCalledWith('kakaoUserId');
        expect(mockJwtManager.makeAccessToken).toHaveBeenCalledWith(2, 'user');
        expect(mockJwtManager.makeRefreshToken).toHaveBeenCalled();
        expect(mockTokenManager.setToken).toHaveBeenCalledWith('2eco', 'mock-refresh-token');

        expect(spySignInDependingOnRegistrationStatus).toHaveBeenCalledWith(mockUser, kakaoData)
        expect(spyInsertUser).toHaveBeenCalledWith(kakaoData.data.id, kakaoData.data.kakao_account.email, kakaoData.data.properties.nickname);
    });


    it('로그아웃 응용 함수', async() => {

        const mockUserId = 'mock-userId';
        mockTokenManager.deleteToken.mockResolvedValue(undefined);

        const result = await authService.logout(mockUserId);

        expect(result).toEqual(undefined);
        expect(mockTokenManager.deleteToken).toHaveBeenCalledWith(mockUserId+"eco");

    });


    it('토큰 재발급 응용 함수', async() => {
        const mockAccessVerifyResult = {
            state: false,
            userId: 1,
            role: 'user'
        };
        const mockAccessDecodedData = {
            message: 'ok',
            userId: 1,
            role: 'user'
        };
        const mockRefreshnVerifyResult = {
            state: true,
            token: 'Bearer mock-refreshToken'
        };
        const mockNewAccessToken = 'mock-new-accessToken';
        const mockReissueTokenResponse = Token.of('mock-new-accessToken', 'Bearer mock-refreshToken');

        mockJwtManager.verify.mockReturnValue(mockAccessVerifyResult);
        mockJwtManager.decode.mockReturnValue(mockAccessDecodedData);
        mockJwtManager.refreshVerify.mockResolvedValue(mockRefreshnVerifyResult);
        mockJwtManager.makeAccessToken.mockReturnValue(mockNewAccessToken);

        const spySignVerifyToken = jest.spyOn(authService, 'signVerifyToken' as any);
        const spySignVerifyAccessToken = jest.spyOn(authService, 'signVerifyAccessToken' as any);
        const spySignVerifyRefreshToken = jest.spyOn(authService, 'signVerifyRefreshToken' as any);

        const result = await authService.reissueToken('Bearer mock-access-token','Bearer mock-refresh-token');

        expect(result).toEqual(mockReissueTokenResponse);
        expect(mockJwtManager.verify).toHaveBeenCalledWith('mock-access-token');
        expect(mockJwtManager.decode).toHaveBeenCalledWith('mock-access-token');
        expect(mockJwtManager.refreshVerify).toHaveBeenCalledWith('Bearer mock-refresh-token', mockAccessDecodedData.userId);
        expect(mockJwtManager.makeAccessToken).toHaveBeenCalledWith(mockAccessDecodedData.userId, mockAccessDecodedData.role);

        expect(spySignVerifyToken).toHaveBeenCalledWith(mockAccessVerifyResult.state, mockRefreshnVerifyResult.state);
        expect(spySignVerifyAccessToken).toHaveBeenCalledWith(mockAccessVerifyResult.state);
        expect(spySignVerifyRefreshToken).toHaveBeenCalledWith(mockRefreshnVerifyResult.state);

    })

        

        

   


});

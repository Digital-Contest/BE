
import { UserRepository } from "../../src/repository/User.Repository";
import { TokenManager } from "../../src/util/TokenManager";
import { JwtManager } from "../../src/util/JwtManager";
import { SocialLogin } from "../../src/util/SocialLogin";
import { Axios, AxiosResponse } from "axios";
import { User } from "../../src/entity/User";
import { AuthService } from "../../src/service/Auth.Service";
import { LoginResponse } from "../../src/dto/response/loginResponse";


jest.mock('../../src/repository/User.Repository');
jest.mock('../../src/util/TokenManager');
jest.mock('../../src/util/JwtManager');
jest.mock('../../src/util/SocialLogin');
jest.mock('../../src/entity/User')

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
 //   describe('카카오 로그인 응용 서비스 ', () => {
    it('카카오 로그인 결과 반환', async () => {
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

        const mockLoginResponse: LoginResponse= LoginResponse.of('mock-access-token', 'mock-refresh-token', 'user');

        const result = await authService.kakaoLogin(kakaoToken);

        expect(result).toEqual(mockLoginResponse);
        expect(mockSocialLogin.getKakaoData).toHaveBeenCalledWith('kakao-token');
        expect(mockUserRepository.findUserByKakaoId).toHaveBeenCalledWith('kakaoUserId');
        expect(mockJwtManager.makeAccessToken).toHaveBeenCalledWith(2, 'user');
        expect(mockJwtManager.makeRefreshToken).toHaveBeenCalled();
        expect(mockTokenManager.setToken).toHaveBeenCalledWith('2eco', 'mock-refresh-token');
    });
 //   });

    it('로그아웃 응용 함수', async () => {

        const mockUserId = 'mock-userId';
        mockTokenManager.deleteToken.mockResolvedValue(undefined);

        const result = await authService.logout(mockUserId);

        expect(result).toEqual(undefined);
        expect(mockTokenManager.deleteToken).toHaveBeenCalledWith(mockUserId+"eco");

    });

        

        

   


});

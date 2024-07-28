import { AuthController } from '../../src/controller/Auth.Controller';
import { AuthService } from '../../src/service/Auth.Service';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import { LoginResponse } from '../../src/dto/response/loginResponse';
import { Request, Response } from 'express';
import { Token } from '../../src/dto/response/Token';
import { redisClient } from '../../src/config/redis';


jest.mock('../../src/service/Auth.Service');


const mockAuthService = new AuthService(
  {} as any, // Mocked UserRepository
  {} as any, // Mocked JwtManager
  {} as any, // Mocked TokenManager
  {} as any  // Mocked SocialLogin
) as jest.Mocked<AuthService>;

const authController = new AuthController(mockAuthService);

describe('AuthController 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('POST /auth/login/kakao', () => {
    it('로그인 응답이 성공적으로 반환', async () => {

      const mockLoginResponse: LoginResponse = LoginResponse.of('dummy-token', 'dummy-token', 'user');
      mockAuthService.kakaoLogin.mockResolvedValue(mockLoginResponse);  // 비동기로 반환할 값을 설정함.

      const req = { headers: { authorization: 'testToken' } } as unknown as Request;
      const result = await authController.kakaoLogin(req);
      expect(result).toEqual(SuccessResponseDto.of(mockLoginResponse)); // 기대한 값과 실제 값이 일치하는지를 검증, 객체나 배열의 경우 구조와 내용이 동일한지를 검사
      expect(mockAuthService.kakaoLogin).toHaveBeenCalledWith('testToken');  // service 함수가 특정 인자로 호출되었는지 검증
    });
  });

  describe('DELETE /auth/logout', () => {
    it('로그아웃 메서드가 호출', async () => {
      const mockUserId = '12345';
      const req = { decoded: { user_id: mockUserId } } as unknown as Request;
      await authController.logout(req);

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockUserId);
      expect({}).toEqual({});
    });
  });

  describe('POST /auth/token-reissue', () => {
    it('새로운 액세스 토큰과 리프레시 토큰 반환', async () => {

        const mockTokenResponse = Token.of('new-access-token', 'new-refresh-token');
        mockAuthService.reissueToken.mockResolvedValue(mockTokenResponse);

        const req = { headers: { authorization: 'Bearer oldAccessToken', refresh: 'oldRefreshToken' } } as unknown as Request;
        const result = await authController.reissueToken(req);

        expect(mockAuthService.reissueToken).toHaveBeenCalledWith('Bearer oldAccessToken', 'oldRefreshToken');
        expect(result).toEqual(SuccessResponseDto.of(mockTokenResponse));

    });
  });
});

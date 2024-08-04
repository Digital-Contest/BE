import {SocialLogin} from '../../src/util/SocialLogin';
import axios, {AxiosResponse} from 'axios';



  jest.mock('axios');
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  const mockResponse: AxiosResponse<any> = {
    data: { id: '12345', nickname: 'Test User' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as AxiosResponse<any>;
describe('SocialLogin 테스트', () => {
    let socialLogin: SocialLogin;

    beforeEach(() => {
      socialLogin = new SocialLogin();
    });

    describe('getKakaoData 함수 테스트', () => {
        const token = 'mock-token';
        it('getKakaoData 함수 정상 처리', async () => {
            mockedAxios.get.mockResolvedValue(mockResponse)
            const result = await socialLogin.getKakaoData(token);
            expect(result).toEqual(mockResponse);
            expect(mockedAxios.get).toHaveBeenCalledWith('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        });

        it('getKakaoData 함수 에러 처리', async () => {
            const error = new Error('error');
            mockedAxios.get.mockRejectedValue(error);
            await expect(socialLogin.getKakaoData(token)).rejects.toThrow('error');
        });

    });
});
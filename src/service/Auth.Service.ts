import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository';
import { JwtManager } from '../util/JwtManager';
import { TokenManager } from '../util/TokenManager';
import { LoginResponse } from '../dto/response/loginResponse';
import { SocialLogin } from '../util/SocialLogin';
import { Token } from '../dto/response/Token';
import { User } from '../entity/User';
import { ErrorResponseDto } from '../response/ErrorResponseDto';
import { ErrorCode } from '../exception/ErrorCode';
import { AxiosResponse } from 'axios';
import { checkData } from '../util/checker';
import { signVerifyAccessToken, signVerifyRefreshToken } from '../util/verify';

require('dotenv').config();


@Service()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        private readonly jwtManager: JwtManager,
        private readonly tokenManager: TokenManager,
        private readonly socialLogin: SocialLogin,
    ) {}


    public async kakaoLogin(kakaoToken: string): Promise<LoginResponse> {

        const kakaoData = await this.socialLogin.getKakaoData(kakaoToken);
        const userData: User = await this.userRepository.findUserByKakaoId(kakaoData.data.id);
        await this.signInDependingOnRegistrationStatus(userData, kakaoData);
        const checkedUserData: User = await this.userRepository.findUserByKakaoId(kakaoData.data.id);
        const accessToken = this.jwtManager.makeAccessToken(checkedUserData.getId(), checkedUserData.getRole()); 
        const refreshToken = this.jwtManager.makeRefreshToken();
        await this.tokenManager.setToken(String(checkedUserData.getId()+"eco"), refreshToken);
        return LoginResponse.of(accessToken, refreshToken, checkedUserData.getRole());
    }

    public async logout(userId: string): Promise<void> {
        await this.tokenManager.deleteToken(userId+"eco")
    }


    public async reissueToken(accessToken: string, refreshToken: string): Promise<Token>{
        const accessTokenVerifyResult = this.jwtManager.verify(accessToken.split('Bearer ')[1]);
        const accessTokenDecodedData = this.jwtManager.decode(accessToken.split('Bearer ')[1]);
        const refreshTokenVerifyesult = await this.jwtManager.refreshVerify(refreshToken, accessTokenDecodedData.userId);
        this.signVerifyToken(accessTokenVerifyResult.state, refreshTokenVerifyesult.state);
        const newAccessToken = this.jwtManager.makeAccessToken(accessTokenDecodedData.userId, accessTokenDecodedData.role);
        return Token.of(newAccessToken, refreshTokenVerifyesult.token);
    }

    private async signInDependingOnRegistrationStatus(userData: User, kakaoData: AxiosResponse<any>) {
        if (!checkData(userData)) {
            await this.userRepository.insertUser(kakaoData.data.id, kakaoData.data.kakao_account.email, kakaoData.data.properties.nickname);
        }
    }
    
    private signVerifyToken(accessTokenVerifyResult: boolean, refreshTokenVerifyesult: boolean){
        signVerifyRefreshToken(refreshTokenVerifyesult);
        signVerifyAccessToken(accessTokenVerifyResult);
    }




}

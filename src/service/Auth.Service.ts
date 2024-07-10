import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository.js';
import { createRequire } from 'module'
import { JwtManager } from '../util/JwtManager.js';
import { TokenManager } from '../util/TokenManager.js';
import { LoginResponse } from '../dto/response/loginResponse.js';
import { SocialLogin } from '../util/SocialLogin.js';
import { Token } from '../dto/response/Token.js';
import { User } from '../entity/User.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';
import { AxiosResponse } from 'axios';
import { checkData } from '../util/checker.js';
const require = createRequire(import.meta.url)
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
            await this.userRepository.insertUser(kakaoData.data.id, kakaoData.data.kakao_account.email);
        }
    }
    
    private signVerifyToken(accessTokenVerifyResult: boolean, refreshTokenVerifyesult: boolean){
        this.signVerifyRefreshToken(refreshTokenVerifyesult);
        this.signVerifyAccessToken(accessTokenVerifyResult);
    }

    private signVerifyAccessToken(status: boolean){
        if(status)
            throw ErrorResponseDto.of(ErrorCode.NOT_EXPIRED);
    }

    private signVerifyRefreshToken(status: boolean){
        if(!status)
            throw  ErrorResponseDto.of(ErrorCode.LOGIN_AGAIN);        
    }



}

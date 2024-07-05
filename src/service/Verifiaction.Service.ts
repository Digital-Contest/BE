
import { JwtManager } from "../util/JwtManager.js";
import { ErrorCode } from "../exception/ErrorCode.js";
import { Token } from "../dto/response/Token.js";
import { Service } from "typedi";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";



@Service()
export class VerificationService{
    constructor(
        private readonly jwtManager: JwtManager,
    ) { }
    
    public async reissueToken(accessToken: string, refreshToken: string): Promise<Token>{
        const accessTokenVerifyResult = this.jwtManager.verify(accessToken.split('Bearer ')[1]);
        const accessTokenDecodedData = this.jwtManager.decode(accessToken.split('Bearer ')[1]);
        const refreshTokenVerifyesult = await this.jwtManager.refreshVerify(refreshToken.split('Bearer ')[1], accessTokenDecodedData.userId);
        this.signVerifyToken(accessTokenVerifyResult.state, refreshTokenVerifyesult.state);
        const newAccessToken = this.jwtManager.makeAccessToken(accessTokenDecodedData.userId, accessTokenDecodedData.role);
        return Token.of(newAccessToken, refreshTokenVerifyesult.token);
    }

    private signVerifyToken(accessTokenVerifyResult: boolean, refreshTokenVerifyesult: boolean){
        this.signVerifyAccessToken(accessTokenVerifyResult);
        this.signVerifyRefreshToken(refreshTokenVerifyesult);
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
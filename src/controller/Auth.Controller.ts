import { JsonController, Post, Body, Res, HttpCode, Req, Delete, UseBefore } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { LoginResponse } from "../dto/response/loginResponse";
import { compareAuthToken } from "../middleware/jwtMiddleware";



@Service()
@JsonController('/auth')
export class AuthController {
    constructor(
        private authService: AuthService) {}

@HttpCode(200)
@Post('/login/kakao')
async kakaoLogin(@Req() req: Request) {
        const result : LoginResponse = await this.authService.kakaoLogin(req.headers["authorization"]);
        console.log("카카오 로그인 완료");
        return SuccessResponseDto.of(result);
   
}

@HttpCode(200)
@UseBefore(compareAuthToken)
@Delete('/logout')
async logout(@Req() req: Request) {
        await this.authService.logout(String(req.decoded.user_id));   
        console.log("로그아웃 완료"); 
        return SuccessResponseDto.of(); 
}

@HttpCode(200)
@Post('/token-reissue')
async reissueToken(@Req() req:Request){
        const accessToken = req.headers.authorization;
        const refreshToken = req.headers.refresh as string;
        const result = await this.authService.reissueToken(accessToken, refreshToken);
        console.log("토큰 재발급 완료");
        return SuccessResponseDto.of(result); 
}

}
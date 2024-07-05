import { JsonController, Post, Body, Res, HttpCode, Req, Delete } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { ErrorHandler } from "../exception/ErrorHandler.js";
import { refreshToken } from "firebase-admin/app";



@Service()
@JsonController('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,  private errorHandler: ErrorHandler) {}

@HttpCode(200)
@Post('/login/kakao')
async login(
    @Req() req:Request, 
    @Res() response: Response) {
   
}

@HttpCode(200)
@Delete('/logout')
async logout(
    @Req() req: Request, 
    @Res() response: Response) {
  
}

@HttpCode(200)
@Post('/token-reissue')
async reissueToken(
    @Req() req:Request, 
    @Res() response: Response){
   
}

}
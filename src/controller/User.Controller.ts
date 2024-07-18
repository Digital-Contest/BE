import { JsonController, HttpCode, Req,  UseBefore, Get } from "routing-controllers";
import { Request } from "express";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { UserService } from "../service/User.Service";
import { UserNickname } from "../dto/response/UserNickname";



@Service()
@JsonController('/user')
export class UserController {
    constructor(
        private userService: UserService) {}


    /**
     * 유저 닉네임 조회 함수
     * @param req 
     * @returns 유저 닉네임
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/nickname')
    async bringNickname(@Req() req: Request): Promise<SuccessResponseDto<UserNickname>> {
        const result = await this.userService.bringNickname(req.decoded.user_id);
        console.log("유저 닉네임 조회 완료");
        return SuccessResponseDto.of(result);
    }



}
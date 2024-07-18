import { Service } from "typedi";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "jsonwebtoken"
import { TokenManager } from "./TokenManager";
import { envs } from "../config/environment";

@Service()
export class JwtManager {

    constructor(
        private readonly tokenManager: TokenManager
    ){}

    public makeAccessToken(user_id: number, userRole: string): string{
        const payload = {
            user_id: user_id,
            role: userRole,
        };
        return 'Bearer ' + jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: envs.jwt.accessTime,
        });
    }

    public makeRefreshToken(){
        return 'Bearer ' + jwt.sign({}, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: envs.jwt.refreshTime,
        });
    }

    public decode(token: string){
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            return {
                message: "Ok",
                userId: decoded.user_id,
                role: decoded.role,
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    public verify(token: string){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
            return {
                state: true,
                userId: decoded!.user_id,
                role: decoded!.role,
            };
        } catch (err) {
            return {
                state: false,
            };
        }
    };

     public async refreshVerify (requestToken: string, userId: number){
        try {  
            const responseToken = await this.tokenManager.getToken(userId+"eco");
            if (this.verifyToken(requestToken, responseToken)) {
                jwt.verify(requestToken.split('Bearer ')[1], process.env.JWT_SECRET) as JwtPayload
                return { state: true, token: responseToken };
            }
            return { state: false };
        } catch (err) {
            return { state: false };
        }
    };

    private verifyToken(externalToken: string, internalToken: string): boolean{
        if(externalToken.split('Bearer ')[1] === internalToken.split('Bearer ')[1])
            return true;
        return false;
    }



}
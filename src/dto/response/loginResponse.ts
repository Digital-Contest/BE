
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LoginResponse {

    private accessToken: string;
    private refreshToken: string;
    private role: string;



    constructor(accessToken: string, refreshToken: string, role: string){
       this.setAccessToken(accessToken),
       this.setRefreshToken(refreshToken),
       this.setRole(role)
    }

    public static of(accessToken: string, refreshToken: string, role: string): LoginResponse{

        return new LoginResponse(accessToken, refreshToken, role);
 
    }

    private setAccessToken(accessToken:string): void{
        if(accessToken === null) throw new Error (`${__dirname} : AccessToken 값이 존재하지 않습니다.`);
        this.accessToken=accessToken;
    }

    private setRefreshToken(refreshToken:string): void {
        if(refreshToken === null) throw new Error (`${__dirname} : RefreshToken 값이 존재하지 않습니다.`);
        this.refreshToken=refreshToken;
    }
    private setRole(role:string): void{
        if(role === null) throw new Error  (`${__dirname} : Role 값이 존재하지 않습니다.`);
        this.role=role;
    }




}
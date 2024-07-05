
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Token{

    private accessToken: string;
    private refreshToken: string;

    constructor(accessToken: string, refreshToken: string){
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
    }

    public static of(accessToken: string, refreshToken: string){
        return new Token(accessToken, refreshToken);
    }


    private setAccessToken(accessToken: string){
        if(accessToken === null)
            throw new Error (`${__dirname} : AccessToken 값이 존재하지 않습니다.`);
        this.accessToken=accessToken;
    }

    private setRefreshToken(refreshToken: string){
        if(refreshToken === null)
            throw new Error (`${__dirname} : RefreshToken 값이 존재하지 않습니다.`);
        this.refreshToken=refreshToken;
    }
}
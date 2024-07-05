import { Service } from "typedi";
import { redisClient } from "../config/redis.js";

@Service()
export class TokenManager{

    async  setToken(key:string, value:string) {
        await redisClient.set(key, value)
    }

    public async deleteToken(key:string){
        await redisClient.del(`refreshToken_${key}`);
    }

    public async getToken(key:string): Promise<string>{   
        return redisClient.get(`refreshToken_${key}`);
    }

}
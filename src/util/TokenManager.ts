import { Service } from "typedi";
import { redisClient } from "../config/redis";

@Service()
export class TokenManager{

    public async setToken(key:string, value:string) {
        await redisClient.v4.set(key, value);
    }

    public async deleteToken(key:string){
        await redisClient.v4.del(String(key));
    }

    public async getToken(key:string){   
        return await redisClient.v4.get(key);
    }

}
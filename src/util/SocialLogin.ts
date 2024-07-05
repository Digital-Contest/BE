
import axios, {AxiosResponse} from 'axios';
import { Service } from 'typedi';


@Service()
export class SocialLogin {

    public async getKakaoData(token: string): Promise<AxiosResponse<any>>{
        return await axios({
            method: 'get',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    }

}

import axios, {AxiosResponse} from 'axios';
import { Service } from 'typedi';


@Service()
export class SocialLogin {

    public async getKakaoData(token: string): Promise<AxiosResponse<any>>{
        return axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    }

}
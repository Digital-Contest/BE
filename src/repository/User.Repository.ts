import { EntityRepository, Repository } from 'typeorm';
import path from 'path';
import { User } from '../entity/User.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * User DAO Class
 */

@EntityRepository(User)
export class UserRepository extends Repository<User> {


    // 카카오Id로 사용자 찾기
    public async findByKakaoId(kakaoId: string): Promise<User> {
        return this.createQueryBuilder()
            .select('u')
            .from(User, 'u')
            .where('u.numbers = :kakaoId',{kakaoId})
            .getOne()
    }

    // 사용자 정보 생성 및 업데이트
    public async insertUser(numbers: string, email: string): Promise<User> {
        const newUser = User.createUser(numbers, email, "USER")
        return this.save(newUser);
    }

    // id(번호)로 사용자 찾기
    public async findUserById(id: number): Promise<User | undefined> {
        return await this.findOne({ where: {id} })
    }

 }
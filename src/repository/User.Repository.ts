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


   /**
    * 카카오 번호로 유저 엔티티 조회 함수
    * @param kakaoId 카카오 번호 -> numbers
    * @returns 유저 엔티티
    */
    public async findUserByKakaoId(kakaoId: string): Promise<User> {
        return this.createQueryBuilder()
            .select('u')
            .from(User, 'u')
            .where('u.numbers = :kakaoId',{kakaoId})
            .getOne()
    }

    /**
     * 카카오 유저 생성 함수
     * @param numbers 카카오 번호
     * @param email 카카오 지정 이메일
     * @returns 생성 유저 엔티티
     */
    public async insertUser(numbers: string, email: string, nickname:string): Promise<User> {
        const newUser = User.createUser(numbers, email, "USER", nickname)
        return this.save(newUser);
    }


    /**
     * 유저 id에 따른 유저 엔티티 조회 함수
     * @param id 유저 id
     * @returns 해당 유저 엔티티 
     */
    public async findUserById(id: number): Promise<User | undefined> {
        return await this.findOne({ where: {id} })
    }

    /**
     * 유저에 따라 유저 점수를 업데이트 해주는 함수
     * @param userId 유저 id
     * @param score 추가할 점수
     * @returns ..
     */
    public async updateUserScore(userId:number, addScore:number){
        return this.createQueryBuilder()
            .update(User)
            .set({ score: () => `score + :addScore` })
            .where('id = :userId',{userId})
            .setParameters({ addScore })
            .execute();
    }

 }
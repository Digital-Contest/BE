import { mockDeep, mockReset } from 'jest-mock-extended';
import { User } from '../../src/entity/User';
import { UserRepository } from '../../src/repository/User.Repository';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';

const mockUser = {
    numbers: '2023',
    email: 'exam@aa.com',
    role: 'user',
    nickname: 'Test user'
} as User;

const mockSelectQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(mockUser),
} as unknown as SelectQueryBuilder<User>;

const mockUpdateQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as UpdateQueryBuilder<User>;

const mockUserRepository = mockDeep<Repository<User>>();
let userRepository: UserRepository;

beforeEach(() => {
    mockReset(mockUserRepository);
    userRepository = new UserRepository();
    userRepository['createQueryBuilder'] = mockUserRepository.createQueryBuilder;
    userRepository['save'] = mockUserRepository.save;
    userRepository['findOne'] = mockUserRepository.findOne;
    jest.spyOn(User, 'createUser').mockReturnValue(mockUser);
});

describe('UserRepository 테스트', () => {

    describe('findUserByKakaoId 테스트', () => {
        it('findUserByKakaoId 정상 테스트', async () => {
            const kakaoId = 'mock-kakaoId';
            mockUserRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder as any);
            const result = await userRepository.findUserByKakaoId(kakaoId);
            expect(result).toBe(mockUser);
            expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('u');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(User, 'u');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('u.numbers = :kakaoId', { kakaoId });
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });

    describe('insertUser 테스트', () => {
        it('insertUser 정상 테스트', async () => {
            userRepository['save'] = jest.fn().mockResolvedValue(mockUser);
            const result = await userRepository.insertUser('1234567890', 'user@example.com', 'Test User');
            expect(result).toEqual(mockUser);
            expect(userRepository['save']).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findUserById 테스트', () => {
        it('findUserById 정상 테스트', async () => {
            const userId = 2;
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            const result = await userRepository.findUserById(userId);
            expect(result).toBe(mockUser);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
        });
    });

    describe('updateUserScore 테스트', () => {
        it('updateUserScore 정상 테스트', async () => {
            const userId = 1;
            const addScore = 10;
            const score = 1
            mockUserRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as any);
            const result = await userRepository.updateUserScore(userId, addScore);
            expect(userRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(User);
            const setCallArg = (mockUpdateQueryBuilder.set as jest.Mock).mock.calls[0][0];
           // mockUpdateQueryBuilder.set가 호출된 때의 인자를 추출
            // [0]은 첫 번째 호출의 기록을 의미합니다.
            // [0]에서 [0]은 첫 번째 호출 시 전달된 인자를 의미합니다.
            // 이 인자는 객체 형태로, 여기서는 { score: () => 'score + :addScore' } 형태로 예상됩니다.
            expect(setCallArg.score).toBeInstanceOf(Function);
            // setCallArg.score가 함수인지 확인
            expect(setCallArg.score()).toBe('score + :addScore');
            // score 함수가 올바른 문자열을 반환하는지 확인
            expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :userId', { userId });
            expect(mockUpdateQueryBuilder.setParameters).toHaveBeenCalledWith({ addScore });
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
            expect(result).toEqual({ affected: 1 });  
        });

    });
});

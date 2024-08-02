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

const mockRepository = mockDeep<Repository<User>>();

let userRepository: UserRepository;

// 테스트 전에 모의 객체 리셋
beforeEach(() => {
    mockReset(mockRepository);

    mockRepository.createQueryBuilder.mockImplementation((alias?: string) => {
        if (alias === 'update') {
            return mockUpdateQueryBuilder as unknown as SelectQueryBuilder<User>;
        }
        return mockSelectQueryBuilder as unknown as SelectQueryBuilder<User>;
    });

    userRepository = new UserRepository();
    userRepository['createQueryBuilder'] = mockRepository.createQueryBuilder;
    userRepository['save'] = mockRepository.save;
    userRepository['findOne'] = mockRepository.findOne;
    jest.spyOn(User, 'createUser').mockReturnValue(mockUser);
});

describe('UserRepository 테스트', () => {

    describe('findUserByKakaoId 테스트', () => {

        it('findUserByKakaoId case1', async () => {
            const kakaoId = 'mock-kakaoId';

            const result = await userRepository.findUserByKakaoId(kakaoId);

            expect(result).toBe(mockUser);
            expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('u.numbers = :kakaoId', { kakaoId });
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });


    describe('insertUser 테스트', () => {

        it('insertUser case1', async () => {
            mockRepository.save.mockResolvedValue(mockUser);

            const result = await userRepository.insertUser('1234567890', 'user@example.com', 'Test User');

            expect(result).toBe(mockUser);
            expect(User.createUser).toHaveBeenCalledWith('1234567890', 'user@example.com', 'USER', 'Test User');
            expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });


    describe('findUserById 테스트', () => {

        it('findUserById case1', async () => {
            const userId = 2;

            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await userRepository.findUserById(userId);

            expect(result).toBe(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
        });
    });

    describe('updateUserScore 테스트', () => {

        it('updateUserScore case1', async () => {
            const userId = 1;
            const addScore = 10;

            // UpdateQueryBuilder를 반환하도록 createQueryBuilder mock을 업데이트합니다.
            mockRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as any);

            const result = await userRepository.updateUserScore(userId, addScore);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
            expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(User);
            expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({ score: expect.any(Function) });
            expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :userId', { userId });
            expect(mockUpdateQueryBuilder.setParameters).toHaveBeenCalledWith({ addScore });
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();

            expect(result).toEqual({ affected: 1 });
        });
    });
});

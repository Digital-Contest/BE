import { TokenManager } from "../../src/util/TokenManager";
import { redisClient } from "../../src/config/redis";


jest.mock('../../src/config/redis', () => ({
    redisClient: {
        v4: {
            set: jest.fn(),
            del: jest.fn(),
            get: jest.fn(),
        },
        quit: jest.fn(),
        on: jest.fn(),
    },
}));

describe('TokenManager 테스트', () => {

    let tokenManager: TokenManager;
    beforeEach(() => {
        tokenManager = new TokenManager();
        jest.clearAllMocks(); 
    });

    afterEach(() => {
        jest.resetAllMocks(); 
    });

    describe('setToken 테스트', () => {
        it('setToken 정상처리', async () => {
            const key = "testKey";
            const value = "testValue";
            await tokenManager.setToken(key, value);
            expect(redisClient.v4.set).toHaveBeenCalledWith(key, value);
            expect(redisClient.v4.set).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteToken 테스트', () => {
        it('deleteToken 정상처리', async () => {
            const key = "testKey";
            await tokenManager.deleteToken(key);
            expect(redisClient.v4.del).toHaveBeenCalledWith(key);
            expect(redisClient.v4.del).toHaveBeenCalledTimes(1); 
        });
    });


    describe('getToke 테스트', () => {
        it('getToke 정상처리', async () => {
            const key = "testKey";
            await tokenManager.getToken(key);
            expect(redisClient.v4.get).toHaveBeenCalledWith(key);
            expect(redisClient.v4.get).toHaveBeenCalledTimes(1); 
        });
    });



});

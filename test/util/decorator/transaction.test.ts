import { Connection, QueryRunner } from 'typeorm';
import { Transactional } from '../../../src/util/decorator/transaction'; // 데코레이터 파일 경로



jest.mock('typeorm', () => {
  return {
    Connection: jest.fn().mockImplementation(() => ({
      createQueryRunner: jest.fn()
    })),
    QueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn()
    }))
  };
});

describe('Transactional Decorator 테스트', () => {
     let mockQueryRunner: jest.Mocked<QueryRunner>;
    let mockConnection: jest.Mocked<Connection>;

    beforeEach(() => {
        mockQueryRunner = new (require('typeorm').QueryRunner)();
        mockConnection = new (require('typeorm').Connection)();
        mockConnection.createQueryRunner.mockReturnValue(mockQueryRunner);
    });
    describe('Transactional Decorator 테스트', () => {
        it('트랜잭션 정상처리', async () => {
            class MyService {
            connection = mockConnection;

            @Transactional()
            async myMethod() {
                return 'test';
            }
            }
            const service = new MyService();
            const result = await service.myMethod();
            expect(result).toBe('test');
            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
        });

        it('트랜잭션 에러 시', async () => {
            class MyService {
            connection = mockConnection;
            @Transactional()
            async myMethod() {
                throw new Error('error');
            }
            }
            const service = new MyService();
            await expect(service.myMethod()).rejects.toThrow('error');
            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
        });
    });
});
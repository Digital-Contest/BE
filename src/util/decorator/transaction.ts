import { Connection, QueryRunner } from 'typeorm';


/**
 * 트랜잭션 수행 데코레이터 함수
 * @returns 
 */
function Transactional() {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const queryRunner: QueryRunner = this.connection.createQueryRunner(); // DataSource 대신 Connection 사용
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const result = await originalMethod.apply(this, args);
                await queryRunner.commitTransaction();
                return result;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
        };
    };
}

export { Transactional };

import { QueryRunner } from 'typeorm';

function Transactional() {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
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
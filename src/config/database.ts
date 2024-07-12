import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { createConnection, useContainer, Connection } from 'typeorm';
import { BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { envs } from './environment.js';
import { Container } from 'typedi';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register TypeORM Connection in typedi container
useContainer(Container);

/**
 * Before insert/update validation data
 */
export abstract class ValidationEntity extends BaseEntity {
    @BeforeInsert()
    @BeforeUpdate()
    async validate(): Promise<void> {
        await validateOrReject(this);
    }
}

export async function initializeDatabase() {
    try {
        const connection = await createConnection({
            name: 'default',
            type: 'mysql',
            host: envs.db.host,
            port: envs.db.port,
            username: envs.db.username,
            password: envs.db.password,
            database: envs.db.database,
            logging: envs.isProd === false,
            synchronize: true,
            entities: [path.join(__dirname, '../entity/*.{js,ts}')],
            namingStrategy: new SnakeNamingStrategy(),
        });

        // Register TypeORM Connection in typedi container
        Container.set(Connection, connection);

        return connection;
    } catch (err) {
        console.error("Error occurred during database initialization", err);
        throw err;
    }
}

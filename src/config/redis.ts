import * as redis from 'redis';
import { createRequire } from 'module'
//const require = createRequire(import.meta.url)


require('dotenv').config();
const redisClient = redis.createClient({            // aws  및 로컬 
    url: `redis://${process.env.AWS_REDIS_ENDPOINT}:${process.env.AWS_REDIS_PORT}`,
    legacyMode: true
});



const connectToRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:');
    }
};

connectToRedis();

export { redisClient };
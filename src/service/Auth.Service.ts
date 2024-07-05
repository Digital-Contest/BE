import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository.js';
import {RedisService} from './Redis.Service.js'


import { createRequire } from 'module'

const require = createRequire(import.meta.url)
require('dotenv').config();


@Service()
export class AuthService {
    
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        private redisService: RedisService
    ) {}



  

}

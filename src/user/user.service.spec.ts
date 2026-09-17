import { beforeEach, describe, it } from 'node:test';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';

void describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;
    let hashing: HashingService;
    beforeEach(async () => { });
    void it('should create a new user', () => { });
});

import { HashingServiceProtocol } from './hashing.service';
import * as bcrypt from 'bcryptjs';

export class BcryptServiceProtocol extends HashingServiceProtocol {
    async hash(password: string): Promise<string> {
        console.log('password: ', password);
        const salt = await bcrypt.genSalt();
        return bcrypt?.hash(password, salt);
    }
    async compare(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}

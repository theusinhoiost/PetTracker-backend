import bcrypt from "bcryptjs";
import { HashingService } from "./hashing.service";

export class BcryptHashingService extends HashingService {
  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async compare(password: string, hash: string): Promise<boolean> {
    const compare = await bcrypt.compare(password, hash);
    return compare;
  }

}

import { compare, hash } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const isValidCompare = await compare(payload, hashed);
    return isValidCompare;
  }
}

export default BCryptHashProvider;

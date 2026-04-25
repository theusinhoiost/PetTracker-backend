import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { EncryptingService } from './encrypting.service';

export class CryptoEncryptingService extends EncryptingService {
  private async getKey() {
    const password = process.env.ENCRYPT_PASSWORD;
    if (!password) throw new Error('Chave inválida');
    return (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  }
  private getIVLength(): number {
    const value = process.env.IV_LENGTH;
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new Error('IV_LENGTH inválido');
    }

    return parsed;
  }

  async encrypt(text: string): Promise<string> {
    const iv = randomBytes(this.getIVLength());
    const key = await this.getKey();

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf-8'),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  async decrypt(encryptedText: string): Promise<string> {
    const [ivHex, contentHex] = encryptedText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');

    const key = await this.getKey();

    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decrypted = Buffer.concat([
      decipher.update(content),
      decipher.final(),
    ]);

    return decrypted.toString('utf-8');
  }
}

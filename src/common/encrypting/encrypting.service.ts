export abstract class EncryptingService {
  abstract encrypt(value: string): Promise<string>;
  abstract decrypt(value: string): Promise<string>;
}

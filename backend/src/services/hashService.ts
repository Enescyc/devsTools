import * as CryptoJS from 'crypto-js';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export interface IHashService {
  generateHash(input: string, algorithm: HashAlgorithm): string;
}

export class HashService implements IHashService {
  generateHash(input: string, algorithm: HashAlgorithm): string {
    try {
      switch (algorithm) {
        case 'md5':
          return CryptoJS.MD5(input).toString();
        case 'sha1':
          return CryptoJS.SHA1(input).toString();
        case 'sha256':
          return CryptoJS.SHA256(input).toString();
        case 'sha512':
          return CryptoJS.SHA512(input).toString();
        default:
          throw new Error('Unsupported hash algorithm');
      }
    } catch (error) {
      throw new Error('Failed to generate hash');
    }
  }
} 
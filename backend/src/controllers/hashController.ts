import { Request, Response } from 'express';
import { IHashService, HashAlgorithm } from '../services/hashService';
import { AppError } from '../middleware/errorHandler';

export class HashController {
  constructor(private hashService: IHashService) {}

  generateHash = async (req: Request, res: Response) => {
    const { text, algorithm } = req.body;

    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'Text input is required');
    }

    if (!algorithm || !['md5', 'sha1', 'sha256', 'sha512'].includes(algorithm)) {
      throw new AppError(400, 'Invalid hash algorithm');
    }

    try {
      const result = this.hashService.generateHash(text, algorithm as HashAlgorithm);
      res.json({ result });
    } catch (error) {
      throw new AppError(400, 'Failed to generate hash');
    }
  };
} 
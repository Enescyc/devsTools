import { Request, Response } from 'express';
import { IUuidService, UuidVersion } from '../services/uuidService';
import { AppError } from '../middleware/errorHandler';

export class UuidController {
  constructor(private uuidService: IUuidService) {}

  generate = async (req: Request, res: Response) => {
    const { version, namespace, name } = req.body;

    if (!version || !['v1', 'v4', 'v5', 'nil'].includes(version)) {
      throw new AppError(400, 'Invalid UUID version');
    }

    if (version === 'v5' && !name) {
      throw new AppError(400, 'Name is required for UUID v5');
    }

    try {
      const result = this.uuidService.generate(version as UuidVersion, namespace, name);
      res.json({ result });
    } catch (error) {
      throw new AppError(400, 'Failed to generate UUID');
    }
  };

  validate = async (req: Request, res: Response) => {
    const { uuid } = req.body;

    if (!uuid || typeof uuid !== 'string') {
      throw new AppError(400, 'UUID input is required');
    }

    try {
      const isValid = this.uuidService.validate(uuid);
      res.json({ isValid });
    } catch (error) {
      throw new AppError(400, 'Failed to validate UUID');
    }
  };

  getInfo = async (req: Request, res: Response) => {
    const { uuid } = req.body;

    if (!uuid || typeof uuid !== 'string') {
      throw new AppError(400, 'UUID input is required');
    }

    try {
      const info = this.uuidService.getInfo(uuid);
      res.json(info);
    } catch (error) {
      throw new AppError(400, 'Failed to get UUID information');
    }
  };

  generateBulk = async (req: Request, res: Response) => {
    const { count, version, namespace, name } = req.body;

    if (!count || typeof count !== 'number' || count < 1) {
      throw new AppError(400, 'Valid count is required (minimum 1)');
    }

    if (!version || !['v1', 'v4', 'v5', 'nil'].includes(version)) {
      throw new AppError(400, 'Invalid UUID version');
    }

    if (version === 'v5' && !name) {
      throw new AppError(400, 'Name is required for UUID v5');
    }

    try {
      const results = this.uuidService.generateBulk(count, version as UuidVersion, namespace, name);
      res.json({ results });
    } catch (error) {
      throw new AppError(400, 'Failed to generate UUIDs');
    }
  };

  getTimestamp = async (req: Request, res: Response) => {
    const { uuid } = req.body;

    if (!uuid || typeof uuid !== 'string') {
      throw new AppError(400, 'UUID input is required');
    }

    try {
      const timestamp = this.uuidService.getTimestamp(uuid);
      if (!timestamp) {
        throw new AppError(400, 'Could not extract timestamp (UUID might not be version 1)');
      }
      res.json({ timestamp });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(400, 'Failed to extract timestamp from UUID');
    }
  };

  generateSequential = async (req: Request, res: Response) => {
    const { count, startTime } = req.body;

    if (!count || typeof count !== 'number' || count < 1) {
      throw new AppError(400, 'Valid count is required (minimum 1)');
    }

    try {
      const startDate = startTime ? new Date(startTime) : undefined;
      if (startTime && isNaN(startDate!.getTime())) {
        throw new AppError(400, 'Invalid start time');
      }

      const results = this.uuidService.generateSequential(count, startDate);
      res.json({ results });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(400, 'Failed to generate sequential UUIDs');
    }
  };
} 
import { Request, Response } from 'express';
import { StringService } from '../services/stringService';

export class StringController {
  private stringService: StringService;

  constructor() {
    this.stringService = new StringService();
  }

  escapeString = (req: Request, res: Response) => {
    const { input, mode } = req.body;

    if (!input || !mode) {
      return res.status(400).json({
        error: 'Input string and mode are required'
      });
    }

    try {
      const result = this.stringService.escapeString(input, mode);
      return res.json({ result });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message
      });
    }
  };

  unescapeString = (req: Request, res: Response) => {
    const { input, mode } = req.body;

    if (!input || !mode) {
      return res.status(400).json({
        error: 'Input string and mode are required'
      });
    }

    try {
      const result = this.stringService.unescapeString(input, mode);
      return res.json({ result });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message
      });
    }
  };

  validateBase64 = (req: Request, res: Response) => {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: 'Input string is required'
      });
    }

    const isValid = this.stringService.validateBase64(input);
    return res.json({ isValid });
  };
} 
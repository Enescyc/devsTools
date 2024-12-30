import { Request, Response } from 'express';
import { RegexService } from '../services/regexService';

export class RegexController {
  private regexService: RegexService;

  constructor() {
    this.regexService = new RegexService();
  }

  testRegex = (req: Request, res: Response) => {
    const { pattern, flags, text } = req.body;

    if (!pattern || !text) {
      return res.status(400).json({
        error: 'Pattern and text are required'
      });
    }

    const result = this.regexService.testRegex(pattern, flags || '', text);
    return res.json(result);
  };

  validatePattern = (req: Request, res: Response) => {
    const { pattern, flags } = req.body;

    if (!pattern) {
      return res.status(400).json({
        error: 'Pattern is required'
      });
    }

    const result = this.regexService.validatePattern(pattern, flags || '');
    return res.json(result);
  };

  getCommonPatterns = (_req: Request, res: Response) => {
    const patterns = this.regexService.getCommonPatterns();
    return res.json(patterns);
  };
} 
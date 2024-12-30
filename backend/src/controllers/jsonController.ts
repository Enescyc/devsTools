import { Request, Response } from 'express';
import { JsonService } from '../services/jsonService';

export class JsonController {
  private jsonService: JsonService;

  constructor() {
    this.jsonService = new JsonService();
  }

  escapeJson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const escaped = this.jsonService.escapeJson(input);
      res.json({ result: escaped });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  unescapeJson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const unescaped = this.jsonService.unescapeJson(input);
      res.json({ result: unescaped });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  formatJson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const formatted = this.jsonService.formatJson(input);
      res.json({ result: formatted });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
} 
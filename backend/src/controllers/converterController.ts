import { Request, Response } from 'express';
import { ConverterService } from '../services/converterService';

export class ConverterController {
  private converterService: ConverterService;

  constructor() {
    this.converterService = new ConverterService();
  }

  jsonToCsv = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const result = this.converterService.jsonToCsv(input);
      res.json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  jsonToXml = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const result = this.converterService.jsonToXml(input);
      res.json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  jsonToYaml = async (req: Request, res: Response): Promise<void> => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== 'string') {
        res.status(400).json({ error: 'Input must be a string' });
        return;
      }

      const result = this.converterService.jsonToYaml(input);
      res.json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
} 
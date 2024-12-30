import { Request, Response } from 'express';
import { DiffService } from '../services/diffService';

export class DiffController {
  private diffService: DiffService;

  constructor() {
    this.diffService = new DiffService();
  }

  computeDiff = (req: Request, res: Response) => {
    const { oldText, newText } = req.body;

    if (!oldText || !newText) {
      return res.status(400).json({
        error: 'Both old and new text are required'
      });
    }

    const result = this.diffService.computeDiff(oldText, newText);
    return res.json(result);
  };

  computeInlineDiff = (req: Request, res: Response) => {
    const { oldLine, newLine } = req.body;

    if (!oldLine || !newLine) {
      return res.status(400).json({
        error: 'Both old and new lines are required'
      });
    }

    const result = this.diffService.computeInlineDiff(oldLine, newLine);
    return res.json(result);
  };
} 
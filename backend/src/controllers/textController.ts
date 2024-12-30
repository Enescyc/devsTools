import { Request, Response } from 'express';
import { ITextFormatter } from '../services/textFormatter';
import { AppError } from '../middleware/errorHandler';

export class TextController {
  constructor(private textFormatter: ITextFormatter) {}

  convertCase = async (req: Request, res: Response) => {
    const { text, type } = req.body;

    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'Text input is required');
    }

    if (!type || !['camel', 'snake', 'pascal', 'kebab'].includes(type)) {
      throw new AppError(400, 'Invalid conversion type');
    }

    let result: string;
    switch (type) {
      case 'camel':
        result = this.textFormatter.toCamelCase(text);
        break;
      case 'snake':
        result = this.textFormatter.toSnakeCase(text);
        break;
      case 'pascal':
        result = this.textFormatter.toPascalCase(text);
        break;
      case 'kebab':
        result = this.textFormatter.toKebabCase(text);
        break;
      default:
        throw new AppError(400, 'Invalid conversion type');
    }

    res.json({ result });
  };
} 
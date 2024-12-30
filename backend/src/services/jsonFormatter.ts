import { AppError } from '../middleware/errorHandler';

export interface IJsonFormatter {
  format(input: string): string;
  minify(input: string): string;
  validate(input: string): boolean;
}

export class JsonFormatter implements IJsonFormatter {
  format(input: string): string {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      throw new AppError(400, 'Invalid JSON input');
    }
  }

  minify(input: string): string {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new AppError(400, 'Invalid JSON input');
    }
  }

  validate(input: string): boolean {
    try {
      JSON.parse(input);
      return true;
    } catch (error) {
      return false;
    }
  }
} 
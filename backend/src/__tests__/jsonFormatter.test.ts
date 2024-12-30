import { JsonFormatter } from '../services/jsonFormatter';
import { AppError } from '../middleware/errorHandler';

describe('JsonFormatter', () => {
  let jsonFormatter: JsonFormatter;

  beforeEach(() => {
    jsonFormatter = new JsonFormatter();
  });

  describe('format', () => {
    it('should format valid JSON string', () => {
      const input = '{"name":"John","age":30}';
      const expected = `{
  "name": "John",
  "age": 30
}`;
      expect(jsonFormatter.format(input)).toBe(expected);
    });

    it('should throw AppError for invalid JSON', () => {
      const input = '{"name":John}'; // Missing quotes around John
      expect(() => jsonFormatter.format(input)).toThrow(AppError);
    });
  });

  describe('minify', () => {
    it('should minify valid JSON string', () => {
      const input = `{
        "name": "John",
        "age": 30
      }`;
      const expected = '{"name":"John","age":30}';
      expect(jsonFormatter.minify(input)).toBe(expected);
    });

    it('should throw AppError for invalid JSON', () => {
      const input = '{name:John}'; // Invalid JSON
      expect(() => jsonFormatter.minify(input)).toThrow(AppError);
    });
  });

  describe('validate', () => {
    it('should return true for valid JSON', () => {
      const input = '{"name":"John","age":30}';
      expect(jsonFormatter.validate(input)).toBe(true);
    });

    it('should return false for invalid JSON', () => {
      const input = '{name:John}'; // Invalid JSON
      expect(jsonFormatter.validate(input)).toBe(false);
    });
  });
}); 
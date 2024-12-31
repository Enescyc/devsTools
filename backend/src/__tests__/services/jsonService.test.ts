import { JsonService } from '../../services/jsonService';

describe('JsonService', () => {
  let jsonService: JsonService;

  beforeEach(() => {
    jsonService = new JsonService();
  });

  describe('escapeJson', () => {
    it('should escape special characters in valid JSON', () => {
      const input = '{"message":"Hello\\nWorld","path":"C:\\\\folder"}';
      const expected = '{\\\"message\\\":\\\"Hello\\\\nWorld\\\",\\\"path\\\":\\\"C:\\\\\\\\folder\\\"}';
      const result = jsonService.escapeJson(input);
      expect(result).toBe(expected);
    });

    it('should throw error for invalid JSON input', () => {
      const input = '{"invalid": "json",}';
      expect(() => jsonService.escapeJson(input)).toThrow('Invalid JSON input');
    });

    it('should handle empty JSON object', () => {
      const input = '{}';
      expect(jsonService.escapeJson(input)).toBe('{}');
    });
  });

  describe('unescapeJson', () => {
    it('should unescape special characters in valid escaped JSON', () => {
      const input = '{\\\"message\\\":\\\"Hello\\\\nWorld\\\",\\\"path\\\":\\\"C:\\\\\\\\folder\\\"}';
      const expected = '{"message":"Hello\\nWorld","path":"C:\\\\folder"}';
      const result = jsonService.unescapeJson(input);
      expect(JSON.parse(result)).toEqual(JSON.parse(expected));
    });

    it('should throw error for invalid escaped JSON input', () => {
      const input = '{\\\"invalid\\\":\\\"json\\\",}';
      expect(() => jsonService.unescapeJson(input)).toThrow('Invalid escaped JSON input');
    });

    it('should handle empty JSON object', () => {
      const input = '{}';
      expect(jsonService.unescapeJson(input)).toBe('{}');
    });
  });

  describe('formatJson', () => {
    it('should format valid JSON with proper indentation', () => {
      const input = '{"name":"John","age":30}';
      const expected = `{
  "name": "John",
  "age": 30
}`;
      expect(jsonService.formatJson(input)).toBe(expected);
    });

    it('should throw error for invalid JSON input', () => {
      const input = '{"invalid": "json",}';
      expect(() => jsonService.formatJson(input)).toThrow('Invalid JSON input');
    });

    it('should handle nested objects', () => {
      const input = '{"user":{"name":"John","age":30}}';
      const expected = `{
  "user": {
    "name": "John",
    "age": 30
  }
}`;
      expect(jsonService.formatJson(input)).toBe(expected);
    });
  });
}); 
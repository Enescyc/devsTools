import { ConverterService } from '../converterService';

describe('ConverterService', () => {
  let converterService: ConverterService;

  beforeEach(() => {
    converterService = new ConverterService();
  });

  describe('jsonToCsv', () => {
    it('should convert a simple JSON object to CSV', () => {
      const input = JSON.stringify({ name: 'John', age: 30, city: 'New York' });
      const result = converterService.jsonToCsv(input);
      expect(result).toContain('"name","age","city"');
      expect(result).toContain('"John",30,"New York"');
    });

    it('should convert an array of JSON objects to CSV', () => {
      const input = JSON.stringify([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]);
      const result = converterService.jsonToCsv(input);
      expect(result).toContain('"name","age"');
      expect(result).toContain('"John",30');
      expect(result).toContain('"Jane",25');
    });

    it('should handle missing values in JSON objects', () => {
      const input = JSON.stringify([
        { name: 'John', age: 30 },
        { name: 'Jane', city: 'London' }
      ]);
      const result = converterService.jsonToCsv(input);
      expect(result).toContain('"name","age","city"');
      expect(result).toContain('"John",30,"N/A"');
      expect(result).toContain('"Jane","N/A","London"');
    });

    it('should throw error for invalid JSON', () => {
      const input = 'invalid json';
      expect(() => converterService.jsonToCsv(input)).toThrow('Failed to convert JSON to CSV');
    });
  });

  describe('jsonToXml', () => {
    it('should convert a simple JSON object to XML', () => {
      const input = JSON.stringify({ name: 'John', age: 30 });
      const result = converterService.jsonToXml(input);
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toMatch(/<root[^>]*>/);
      expect(result).toMatch(/<name>John<\/name>/);
      expect(result).toMatch(/<age>30<\/age>/);
      expect(result).toMatch(/<\/root>/);
    });

    it('should convert nested JSON objects to XML', () => {
      const input = JSON.stringify({
        person: {
          name: 'John',
          address: {
            city: 'New York',
            country: 'USA'
          }
        }
      });
      const result = converterService.jsonToXml(input);
      expect(result).toMatch(/<person>/);
      expect(result).toMatch(/<name>John<\/name>/);
      expect(result).toMatch(/<address>/);
      expect(result).toMatch(/<city>New York<\/city>/);
      expect(result).toMatch(/<country>USA<\/country>/);
      expect(result).toMatch(/<\/address>/);
      expect(result).toMatch(/<\/person>/);
    });

    it('should convert JSON arrays to XML', () => {
      const input = JSON.stringify({
        people: [
          { name: 'John' },
          { name: 'Jane' }
        ]
      });
      const result = converterService.jsonToXml(input);
      expect(result).toMatch(/<people>/);
      expect(result).toMatch(/<name>John<\/name>/);
      expect(result).toMatch(/<name>Jane<\/name>/);
      expect(result).toMatch(/<\/people>/);
    });

    it('should throw error for invalid JSON', () => {
      const input = 'invalid json';
      expect(() => converterService.jsonToXml(input)).toThrow('Failed to convert JSON to XML');
    });
  });

  describe('jsonToYaml', () => {
    it('should convert a simple JSON object to YAML', () => {
      const input = JSON.stringify({ name: 'John', age: 30 });
      const result = converterService.jsonToYaml(input);
      expect(result).toContain('name: John');
      expect(result).toContain('age: 30');
    });

    it('should convert nested JSON objects to YAML', () => {
      const input = JSON.stringify({
        person: {
          name: 'John',
          address: {
            city: 'New York',
            country: 'USA'
          }
        }
      });
      const result = converterService.jsonToYaml(input);
      expect(result).toContain('person:');
      expect(result).toContain('  name: John');
      expect(result).toContain('  address:');
      expect(result).toContain('    city: New York');
      expect(result).toContain('    country: USA');
    });

    it('should convert JSON arrays to YAML', () => {
      const input = JSON.stringify(['apple', 'banana', 'orange']);
      const result = converterService.jsonToYaml(input);
      expect(result).toContain('- apple');
      expect(result).toContain('- banana');
      expect(result).toContain('- orange');
    });

    it('should throw error for invalid JSON', () => {
      const input = 'invalid json';
      expect(() => converterService.jsonToYaml(input)).toThrow('Failed to convert JSON to YAML');
    });
  });
}); 
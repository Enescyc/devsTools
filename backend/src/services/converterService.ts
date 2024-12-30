import { Parser } from 'json2csv';
import { create } from 'xmlbuilder2';
import yaml from 'js-yaml';

export class ConverterService {
  jsonToCsv(input: string): string {
    try {
      const jsonData = JSON.parse(input);
      
      // Handle array of objects
      const data = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      // Get all possible fields from all objects
      const fields = new Set<string>();
      data.forEach(item => {
        Object.keys(item).forEach(key => fields.add(key));
      });

      const parser = new Parser({
        fields: Array.from(fields),
        defaultValue: 'N/A' // For missing values
      });

      return parser.parse(data);
    } catch (error) {
      throw new Error('Failed to convert JSON to CSV: ' + (error as Error).message);
    }
  }

  jsonToXml(input: string): string {
    try {
      const jsonData = JSON.parse(input);
      const doc = create({ version: '1.0', encoding: 'UTF-8' });
      const root = doc.ele('root');
      
      const addNode = (parent: any, data: any) => {
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              const arrayItem = parent.ele('item');
              Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  addNode(arrayItem.ele(key), value);
                } else {
                  arrayItem.ele(key).txt(String(value));
                }
              });
            } else {
              parent.ele('item').txt(String(item));
            }
          });
        } else if (typeof data === 'object' && data !== null) {
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              addNode(parent.ele(key), value);
            } else {
              parent.ele(key).txt(String(value));
            }
          });
        } else {
          parent.txt(String(data));
        }
      };

      addNode(root, jsonData);
      return doc.end({ prettyPrint: true });
    } catch (error) {
      throw new Error('Failed to convert JSON to XML: ' + (error as Error).message);
    }
  }

  jsonToYaml(input: string): string {
    try {
      const jsonData = JSON.parse(input);
      return yaml.dump(jsonData, {
        indent: 2,
        lineWidth: -1, // Don't wrap lines
        noRefs: true, // Don't use aliases
      });
    } catch (error) {
      throw new Error('Failed to convert JSON to YAML: ' + (error as Error).message);
    }
  }
} 
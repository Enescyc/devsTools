export interface ITextFormatter {
  toCamelCase(input: string): string;
  toSnakeCase(input: string): string;
  toPascalCase(input: string): string;
  toKebabCase(input: string): string;
}

export class TextFormatter implements ITextFormatter {
  toCamelCase(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, chr => chr.toLowerCase());
  }

  toSnakeCase(input: string): string {
    return input
      .replace(/[A-Z]/g, chr => `_${chr.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_/, '')
      .toLowerCase();
  }

  toPascalCase(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, chr => chr.toUpperCase());
  }

  toKebabCase(input: string): string {
    return input
      .replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-/, '')
      .toLowerCase();
  }
} 
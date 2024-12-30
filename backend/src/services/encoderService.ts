export interface IEncoderService {
  encodeBase64(input: string): string;
  decodeBase64(input: string): string;
  encodeUrl(input: string): string;
  decodeUrl(input: string): string;
  encodeHtml(input: string): string;
  decodeHtml(input: string): string;
}

export class EncoderService implements IEncoderService {
  private htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  private reverseHtmlEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };

  encodeBase64(input: string): string {
    try {
      return Buffer.from(input).toString('base64');
    } catch (error) {
      throw new Error('Failed to encode to Base64');
    }
  }

  decodeBase64(input: string): string {
    try {
      return Buffer.from(input, 'base64').toString('utf-8');
    } catch (error) {
      throw new Error('Failed to decode from Base64');
    }
  }

  encodeUrl(input: string): string {
    try {
      return encodeURIComponent(input);
    } catch (error) {
      throw new Error('Failed to encode URL');
    }
  }

  decodeUrl(input: string): string {
    try {
      return decodeURIComponent(input);
    } catch (error) {
      throw new Error('Failed to decode URL');
    }
  }

  encodeHtml(input: string): string {
    try {
      return input.replace(/[&<>"'`=\/]/g, char => this.htmlEntities[char]);
    } catch (error) {
      throw new Error('Failed to encode HTML');
    }
  }

  decodeHtml(input: string): string {
    try {
      return input.replace(/&[^;]+;/g, entity => {
        return this.reverseHtmlEntities[entity] || entity;
      });
    } catch (error) {
      throw new Error('Failed to decode HTML');
    }
  }
} 
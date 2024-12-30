export class StringService {
  escapeString(input: string, mode: 'html' | 'js' | 'url' | 'base64'): string {
    switch (mode) {
      case 'html':
        return this.escapeHtml(input);
      case 'js':
        return this.escapeJavaScript(input);
      case 'url':
        return encodeURIComponent(input);
      case 'base64':
        return Buffer.from(input).toString('base64');
      default:
        throw new Error('Unsupported escape mode');
    }
  }

  unescapeString(input: string, mode: 'html' | 'js' | 'url' | 'base64'): string {
    switch (mode) {
      case 'html':
        return this.unescapeHtml(input);
      case 'js':
        return this.unescapeJavaScript(input);
      case 'url':
        return decodeURIComponent(input);
      case 'base64':
        return Buffer.from(input, 'base64').toString('utf-8');
      default:
        throw new Error('Unsupported unescape mode');
    }
  }

  private escapeHtml(input: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return input.replace(/[&<>"'`=\/]/g, char => htmlEntities[char]);
  }

  private unescapeHtml(input: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
    return input.replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, entity => htmlEntities[`&${entity}`]);
  }

  private escapeJavaScript(input: string): string {
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f')
      .replace(/\v/g, '\\v')
      .replace(/\0/g, '\\0')
      .replace(/\b/g, '\\b');
  }

  private unescapeJavaScript(input: string): string {
    return input
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\f/g, '\f')
      .replace(/\\v/g, '\v')
      .replace(/\\0/g, '\0')
      .replace(/\\b/g, '\b')
      .replace(/\\\\/g, '\\');
  }

  validateBase64(input: string): boolean {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(input) && input.length % 4 === 0;
  }
} 
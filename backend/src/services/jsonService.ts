export class JsonService {
  escapeJson(input: string): string {
    try {
      // Parse the input to ensure it's valid JSON
      JSON.parse(input);
      
      // Escape special characters
      return input
        .replace(/\\/g, '\\\\')  // backslash
        .replace(/"/g, '\\"')    // double quotes
        .replace(/\n/g, '\\n')   // new line
        .replace(/\r/g, '\\r')   // carriage return
        .replace(/\t/g, '\\t')   // tab
        .replace(/\f/g, '\\f')   // form feed
        .replace(/\b/g, '\\b');  // backspace
    } catch (error) {
      throw new Error('Invalid JSON input');
    }
  }

  unescapeJson(input: string): string {
    try {
      // First, verify if the input is a valid escaped JSON string
      const unescaped = input
        .replace(/\\\\/g, '\\')  // backslash
        .replace(/\\"/g, '"')    // double quotes
        .replace(/\\n/g, '\n')   // new line
        .replace(/\\r/g, '\r')   // carriage return
        .replace(/\\t/g, '\t')   // tab
        .replace(/\\f/g, '\f')   // form feed
        .replace(/\\b/g, '\b');  // backspace

      // Validate the unescaped string is valid JSON
      JSON.parse(unescaped);
      return unescaped;
    } catch (error) {
      throw new Error('Invalid escaped JSON input');
    }
  }

  formatJson(input: string): string {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      throw new Error('Invalid JSON input');
    }
  }
} 
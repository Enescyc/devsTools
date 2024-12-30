interface RegexMatch {
  match: string;
  index: number;
  groups: { [key: string]: string } | null;
}

interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
}

export class RegexService {
  testRegex(pattern: string, flags: string, text: string): RegexTestResult {
    try {
      // Validate the regex pattern
      const regex = new RegExp(pattern, flags);
      const matches: RegexMatch[] = [];
      
      // Find all matches
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups || null
        });
        
        // Prevent infinite loops for patterns without the global flag
        if (!flags.includes('g')) {
          break;
        }
      }

      return {
        isValid: true,
        matches
      };
    } catch (error) {
      return {
        isValid: false,
        matches: [],
        error: (error as Error).message
      };
    }
  }

  validatePattern(pattern: string, flags: string): { isValid: boolean; error?: string } {
    try {
      new RegExp(pattern, flags);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: (error as Error).message
      };
    }
  }

  getCommonPatterns(): { name: string; pattern: string; description: string }[] {
    return [
      {
        name: 'Email',
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
        description: 'Matches email addresses'
      },
      {
        name: 'URL',
        pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
        description: 'Matches URLs (http/https)'
      },
      {
        name: 'Phone Number',
        pattern: '^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$',
        description: 'Matches international phone numbers'
      },
      {
        name: 'Date (YYYY-MM-DD)',
        pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
        description: 'Matches dates in YYYY-MM-DD format'
      },
      {
        name: 'Time (HH:MM)',
        pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
        description: 'Matches 24-hour time format'
      },
      {
        name: 'IPv4',
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        description: 'Matches IPv4 addresses'
      },
      {
        name: 'Password',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
        description: 'Minimum 8 characters, at least one letter and one number'
      },
      {
        name: 'Username',
        pattern: '^[a-zA-Z0-9_-]{3,16}$',
        description: '3-16 characters, letters, numbers, underscore, hyphen'
      }
    ];
  }
} 
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { FileText, Wand2, Copy, Trash2 } from 'lucide-react';

interface RegexMatch {
  match: string;
  index: number;
  groups: { [key: string]: string } | null;
}

interface CommonPattern {
  name: string;
  pattern: string;
  description: string;
}

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [flags, setFlags] = useState<string[]>([]);
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string>('');
  const [commonPatterns, setCommonPatterns] = useState<CommonPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCommonPatterns();
  }, []);

  const fetchCommonPatterns = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/regex/common-patterns');
      const data = await response.json();
      setCommonPatterns(data);
    } catch (error) {
      console.error('Failed to fetch common patterns:', error);
    }
  };

  const handleTest = async () => {
    if (!pattern.trim() || !text.trim()) {
      toast({
        title: 'Error',
        description: 'Pattern and test text are required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/regex/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pattern,
          flags: flags.join(''),
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test regex');
      }

      setIsValid(data.isValid);
      setMatches(data.matches);
      setError(data.error || '');

      if (data.isValid && data.matches.length > 0) {
        toast({
          title: 'Success',
          description: `Found ${data.matches.length} match${data.matches.length === 1 ? '' : 'es'}`,
        });
      } else if (data.isValid && data.matches.length === 0) {
        toast({
          title: 'No Matches',
          description: 'The pattern did not match any text',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPattern('');
    setText('');
    setFlags([]);
    setMatches([]);
    setError('');
    toast({
      title: 'Cleared',
      description: 'All fields have been cleared',
    });
  };

  const handlePatternSelect = (pattern: string) => {
    setPattern(pattern);
  };

  const handleFlagToggle = (flag: string) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select onValueChange={handlePatternSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Common patterns" />
              </SelectTrigger>
              <SelectContent>
                {commonPatterns.map((p) => (
                  <SelectItem key={p.name} value={p.pattern}>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleTest}
              disabled={isLoading}
              className="space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isLoading ? 'Testing...' : 'Test Regex'}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleClear} className="space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Regex Pattern:</Label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full p-2 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Enter regex pattern..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={flags.includes('g')}
                onCheckedChange={() => handleFlagToggle('g')}
              />
              <span>Global (g)</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={flags.includes('i')}
                onCheckedChange={() => handleFlagToggle('i')}
              />
              <span>Case Insensitive (i)</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={flags.includes('m')}
                onCheckedChange={() => handleFlagToggle('m')}
              />
              <span>Multiline (m)</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={flags.includes('s')}
                onCheckedChange={() => handleFlagToggle('s')}
              />
              <span>Dot All (s)</span>
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Test Text:</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[200px] p-2 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="Enter text to test against..."
            />
          </div>

          {error && (
            <div className="p-4 text-red-600 bg-red-50 rounded-md dark:bg-red-900/20">
              {error}
            </div>
          )}

          {isValid && matches.length > 0 && (
            <div className="space-y-2">
              <Label>Matches ({matches.length}):</Label>
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono">Match {index + 1}:</span>
                      <span className="text-sm text-gray-500">
                        Index: {match.index}
                      </span>
                    </div>
                    <div className="mt-2 font-mono">{match.match}</div>
                    {match.groups && Object.keys(match.groups).length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-semibold">Groups:</div>
                        <pre className="mt-1 text-sm">
                          {JSON.stringify(match.groups, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 
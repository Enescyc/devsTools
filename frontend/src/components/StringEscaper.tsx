import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowDownUp, Copy, Trash2 } from 'lucide-react';

type EscapeMode = 'html' | 'js' | 'url' | 'base64';

export function StringEscaper() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<EscapeMode>('html');
  const [isEscape, setIsEscape] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Input string is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isEscape ? 'escape' : 'unescape';
      const response = await fetch(`http://localhost:3000/api/string/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEscape ? 'escape' : 'unescape'} string`);
      }

      setOutput(data.result);
      toast({
        title: 'Success',
        description: `String ${isEscape ? 'escaped' : 'unescaped'} successfully`,
      });
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
    setInput('');
    setOutput('');
    toast({
      title: 'Cleared',
      description: 'All fields have been cleared',
    });
  };

  const handleCopy = async () => {
    if (!output) {
      toast({
        title: 'Error',
        description: 'No output to copy',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: 'Copied',
        description: 'Output copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleSwap = () => {
    setIsEscape(!isEscape);
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={mode}
              onValueChange={(value: EscapeMode) => setMode(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleProcess}
              disabled={isLoading}
              className="space-x-2"
            >
              <span>{isLoading ? 'Processing...' : isEscape ? 'Escape' : 'Unescape'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleSwap}
              className="space-x-2"
            >
              <ArrowDownUp className="w-4 h-4" />
              <span>Swap Mode</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleCopy} className="space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </Button>
            <Button variant="outline" onClick={handleClear} className="space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Input String:</Label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[200px] p-2 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder={`Enter string to ${isEscape ? 'escape' : 'unescape'}...`}
            />
          </div>

          <div className="space-y-2">
            <Label>Output:</Label>
            <textarea
              value={output}
              readOnly
              className="w-full h-[200px] p-2 font-mono text-sm bg-gray-50 border rounded-md resize-none focus:outline-none dark:bg-gray-900"
              placeholder="Processed output will appear here..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
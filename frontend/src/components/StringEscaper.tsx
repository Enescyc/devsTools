import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { CopyButton } from './ui/copy-button';
import { useHistory } from '@/contexts/HistoryContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FileText, Trash2, Wand2 } from 'lucide-react';

type Operation = 'escape' | 'unescape';
type Mode = 'html' | 'js' | 'url' | 'base64';

export function StringEscaper() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState<Operation>('escape');
  const [mode, setMode] = useState<Mode>('html');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addEntry, registerRestoreCallback, unregisterRestoreCallback } = useHistory();

  useEffect(() => {
    const handleRestore = (entry: any) => {
      setInput(entry.operation.input.input);
      setOutput(entry.operation.output.result);
      setOperation(entry.operation.type as Operation);
      setMode(entry.operation.input.mode as Mode);
    };

    registerRestoreCallback('string', handleRestore);
    return () => unregisterRestoreCallback('string');
  }, [registerRestoreCallback, unregisterRestoreCallback]);

  const handleOperation = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to process',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/string/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process string');
      }

      setOutput(data.result);
      
      // Add to history
      addEntry('string', operation, { input, mode }, { result: data.result });

      toast({
        title: 'Success',
        description: `Operation completed successfully`,
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast({
        title: 'Pasted',
        description: 'Content pasted from clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to paste from clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    toast({
      title: 'Cleared',
      description: 'Input and output cleared',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={operation}
              onValueChange={(value: Operation) => setOperation(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escape">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Escape String
                  </span>
                </SelectItem>
                <SelectItem value="unescape">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Unescape String
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={mode}
              onValueChange={(value: Mode) => setMode(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    HTML
                  </span>
                </SelectItem>
                <SelectItem value="js">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    JavaScript
                  </span>
                </SelectItem>
                <SelectItem value="url">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    URL
                  </span>
                </SelectItem>
                <SelectItem value="base64">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Base64
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleOperation} 
              disabled={isLoading}
              className="space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isLoading ? 'Processing...' : operation === 'escape' ? 'Escape' : 'Unescape'}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePaste} className="space-x-2">
              <FileText className="w-4 h-4" />
              <span>Paste</span>
            </Button>
            <Button variant="outline" onClick={handleClear} className="space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Input:</label>
              <CopyButton value={input} title="Copy Input" />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-[400px] resize-none"
              placeholder="Enter text to escape/unescape..."
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Output:</label>
              <CopyButton value={output} title="Copy Output" />
            </div>
            <Textarea
              value={output}
              readOnly
              className="font-mono h-[400px] resize-none bg-muted"
              placeholder="Processed output will appear here..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
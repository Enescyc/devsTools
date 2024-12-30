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
import { FileJson, Trash2, Wand2 } from 'lucide-react';

type Operation = 'format' | 'escape' | 'unescape' | 'to-csv' | 'to-xml' | 'to-yaml';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState<Operation>('format');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addEntry, registerRestoreCallback, unregisterRestoreCallback } = useHistory();

  useEffect(() => {
    const handleRestore = (entry: any) => {
      setInput(entry.operation.input.input);
      setOutput(entry.operation.output.result);
      setOperation(entry.operation.type as Operation);
    };

    registerRestoreCallback('json', handleRestore);
    return () => unregisterRestoreCallback('json');
  }, [registerRestoreCallback, unregisterRestoreCallback]);

  const handleOperation = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some JSON to process',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      let endpoint = '';
      switch (operation) {
        case 'format':
        case 'escape':
        case 'unescape':
          endpoint = `http://localhost:3000/api/json/${operation}`;
          break;
        case 'to-csv':
          endpoint = 'http://localhost:3000/api/convert/json-to-csv';
          break;
        case 'to-xml':
          endpoint = 'http://localhost:3000/api/convert/json-to-xml';
          break;
        case 'to-yaml':
          endpoint = 'http://localhost:3000/api/convert/json-to-yaml';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process JSON');
      }

      setOutput(data.result);
      
      // Add to history
      addEntry('json', operation, { input }, { result: data.result });

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

  const getOperationLabel = () => {
    switch (operation) {
      case 'format':
        return 'Process';
      case 'escape':
        return 'Escape';
      case 'unescape':
        return 'Unescape';
      case 'to-csv':
        return 'To CSV';
      case 'to-xml':
        return 'To XML';
      case 'to-yaml':
        return 'To YAML';
      default:
        return 'Process';
    }
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
                <SelectItem value="format">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Format JSON
                  </span>
                </SelectItem>
                <SelectItem value="escape">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Escape JSON
                  </span>
                </SelectItem>
                <SelectItem value="unescape">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Unescape JSON
                  </span>
                </SelectItem>
                <SelectItem value="to-csv">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to CSV
                  </span>
                </SelectItem>
                <SelectItem value="to-xml">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to XML
                  </span>
                </SelectItem>
                <SelectItem value="to-yaml">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to YAML
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
              <span>{isLoading ? 'Processing...' : getOperationLabel()}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePaste} className="space-x-2">
              <FileJson className="w-4 h-4" />
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
              <label className="text-sm font-medium">JSON Input:</label>
              <CopyButton value={input} title="Copy Input" />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-[400px] resize-none"
              placeholder={`Enter your JSON here...\nExample:\n{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}`}
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
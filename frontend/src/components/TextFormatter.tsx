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

type Operation = 'camel' | 'snake' | 'pascal' | 'kebab';

export function TextFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState<Operation>('camel');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addEntry, registerRestoreCallback, unregisterRestoreCallback } = useHistory();

  useEffect(() => {
    const handleRestore = (entry: any) => {
      setInput(entry.operation.input.text);
      setOutput(entry.operation.output.result);
      setOperation(entry.operation.type as Operation);
    };

    registerRestoreCallback('text', handleRestore);
    return () => unregisterRestoreCallback('text');
  }, [registerRestoreCallback, unregisterRestoreCallback]);

  const handleOperation = async (type: Operation) => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to convert',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/text/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert text');
      }

      setOutput(data.result);
      setOperation(type);
      
      // Add to history
      addEntry('text', type, { text: input }, { result: data.result });

      toast({
        title: 'Success',
        description: 'Text converted successfully',
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
      description: 'Input and output cleared',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => handleOperation('camel')} 
              disabled={isLoading}
              variant={operation === 'camel' ? 'default' : 'outline'}
              className="space-x-2"
            >
              <span>camelCase</span>
            </Button>
            <Button 
              onClick={() => handleOperation('snake')} 
              disabled={isLoading}
              variant={operation === 'snake' ? 'default' : 'outline'}
              className="space-x-2"
            >
              <span>snake_case</span>
            </Button>
            <Button 
              onClick={() => handleOperation('pascal')} 
              disabled={isLoading}
              variant={operation === 'pascal' ? 'default' : 'outline'}
              className="space-x-2"
            >
              <span>PascalCase</span>
            </Button>
            <Button 
              onClick={() => handleOperation('kebab')} 
              disabled={isLoading}
              variant={operation === 'kebab' ? 'default' : 'outline'}
              className="space-x-2"
            >
              <span>kebab-case</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
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
              placeholder="Enter text to convert..."
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
              placeholder="Converted text will appear here..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
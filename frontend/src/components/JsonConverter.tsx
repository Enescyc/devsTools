import { useState } from 'react';
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
import { Copy, FileJson, Trash2, Wand2 } from 'lucide-react';

type ConversionFormat = 'csv' | 'xml' | 'yaml';

export function JsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<ConversionFormat>('csv');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some JSON to convert',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/convert/json-to-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert JSON');
      }

      setOutput(data.result);
      toast({
        title: 'Success',
        description: `JSON converted to ${format.toUpperCase()} successfully`,
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

  const handleClear = () => {
    setInput('');
    setOutput('');
    toast({
      title: 'Cleared',
      description: 'Input and output cleared',
    });
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

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={format}
              onValueChange={(value: ConversionFormat) => setFormat(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to CSV
                  </span>
                </SelectItem>
                <SelectItem value="xml">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to XML
                  </span>
                </SelectItem>
                <SelectItem value="yaml">
                  <span className="flex items-center">
                    <FileJson className="w-4 h-4 mr-2" />
                    Convert to YAML
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleConvert} 
              disabled={isLoading}
              className="space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isLoading ? 'Converting...' : 'Convert'}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePaste} className="space-x-2">
              <FileJson className="w-4 h-4" />
              <span>Paste</span>
            </Button>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Input:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-[400px] p-2 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder={`Enter your JSON here...\nExample:\n{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Converted Output:</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-[400px] p-2 font-mono text-sm bg-gray-50 border rounded-md resize-none focus:outline-none dark:bg-gray-900"
              placeholder={`Converted ${format.toUpperCase()} will appear here...`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 
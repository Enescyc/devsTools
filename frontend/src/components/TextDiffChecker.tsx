import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { CopyButton } from './ui/copy-button';
import { useHistory } from '@/contexts/HistoryContext';
import { Trash2, Wand2 } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: {
    left?: number;
    right?: number;
  };
}

interface DiffStats {
  additions: number;
  deletions: number;
  unchanged: number;
}

export function TextDiffChecker() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addEntry, registerRestoreCallback, unregisterRestoreCallback } = useHistory();

  useEffect(() => {
    const handleRestore = (entry: any) => {
      setOldText(entry.operation.input.oldText);
      setNewText(entry.operation.input.newText);
      setDiffLines(entry.operation.output.diffLines);
      setStats(entry.operation.output.stats);
    };

    registerRestoreCallback('diff', handleRestore);
    return () => unregisterRestoreCallback('diff');
  }, [registerRestoreCallback, unregisterRestoreCallback]);

  const handleCompare = async () => {
    if (!oldText.trim() || !newText.trim()) {
      toast({
        title: 'Error',
        description: 'Both original and modified text are required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/diff/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldText,
          newText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compute diff');
      }

      setDiffLines(data.lines);
      setStats(data.stats);

      // Add to history
      addEntry('diff', 'compare', 
        { oldText, newText }, 
        { diffLines: data.lines, stats: data.stats }
      );

      toast({
        title: 'Success',
        description: `Found ${data.stats.additions} additions and ${data.stats.deletions} deletions`,
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
    setOldText('');
    setNewText('');
    setDiffLines([]);
    setStats(null);
    toast({
      title: 'Cleared',
      description: 'All fields have been cleared',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleCompare} 
              disabled={isLoading}
              className="space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isLoading ? 'Comparing...' : 'Compare'}</span>
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
              <label className="text-sm font-medium">Original Text:</label>
              <CopyButton value={oldText} title="Copy Original" />
            </div>
            <Textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              className="font-mono h-[300px] resize-none"
              placeholder="Enter the original text here..."
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Modified Text:</label>
              <CopyButton value={newText} title="Copy Modified" />
            </div>
            <Textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="font-mono h-[300px] resize-none"
              placeholder="Enter the modified text here..."
            />
          </div>
        </div>

        {diffLines.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Diff Result:</label>
              <CopyButton 
                value={diffLines.map(line => {
                  const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
                  return prefix + line.content;
                }).join('\n')} 
                title="Copy Diff" 
              />
            </div>
            <div className="p-4 font-mono text-sm bg-gray-50 border rounded-md dark:bg-gray-900">
              {diffLines.map((line, index) => (
                <div
                  key={index}
                  className={`flex ${
                    line.type === 'added'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : line.type === 'removed'
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : ''
                  }`}
                >
                  <div className="w-16 text-gray-500 select-none border-r pr-2">
                    {line.lineNumber.left && (
                      <span className="mr-2">{line.lineNumber.left}</span>
                    )}
                    {line.lineNumber.right && (
                      <span>{line.lineNumber.right}</span>
                    )}
                  </div>
                  <pre className="flex-1 pl-4">
                    <span className="select-none mr-2">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats && (
          <div className="flex space-x-4 text-sm">
            <div className="text-green-600">
              +{stats.additions} additions
            </div>
            <div className="text-red-600">
              -{stats.deletions} deletions
            </div>
            <div className="text-gray-600">
              {stats.unchanged} unchanged
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 
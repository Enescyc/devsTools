import { useState } from 'react';

interface TextResponse {
  result?: string;
  error?: string;
}

export function TextFormatter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TextResponse>({});
  const [loading, setLoading] = useState(false);

  const convertCase = async (type: 'camel' | 'snake' | 'pascal' | 'kebab') => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/text/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, type }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to convert text' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Case Converter</h1>
      
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg font-mono bg-background resize-none"
            placeholder="Enter text to convert..."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => convertCase('camel')}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            camelCase
          </button>
          <button
            onClick={() => convertCase('snake')}
            disabled={loading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            snake_case
          </button>
          <button
            onClick={() => convertCase('pascal')}
            disabled={loading}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            PascalCase
          </button>
          <button
            onClick={() => convertCase('kebab')}
            disabled={loading}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            kebab-case
          </button>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Converting...</div>
        )}

        {result.error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {result.error}
          </div>
        )}

        {result.result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Result</label>
            <pre className="w-full p-4 border rounded-lg font-mono bg-background overflow-auto">
              {result.result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 
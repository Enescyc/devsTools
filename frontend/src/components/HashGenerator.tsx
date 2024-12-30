import { useState } from 'react';

interface HashResponse {
  result?: string;
  error?: string;
}

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<HashResponse>({});
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('sha256');

  const generateHash = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, algorithm }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to generate hash' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Hash Generator</h1>
      
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setAlgorithm('md5')}
            className={`px-4 py-2 rounded-md ${
              algorithm === 'md5'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            MD5
          </button>
          <button
            onClick={() => setAlgorithm('sha1')}
            className={`px-4 py-2 rounded-md ${
              algorithm === 'sha1'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            SHA-1
          </button>
          <button
            onClick={() => setAlgorithm('sha256')}
            className={`px-4 py-2 rounded-md ${
              algorithm === 'sha256'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            SHA-256
          </button>
          <button
            onClick={() => setAlgorithm('sha512')}
            className={`px-4 py-2 rounded-md ${
              algorithm === 'sha512'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            SHA-512
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg font-mono bg-background resize-none"
            placeholder={`Enter text to generate ${algorithm.toUpperCase()} hash...`}
          />
        </div>

        <div>
          <button
            onClick={generateHash}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            Generate Hash
          </button>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Generating hash...</div>
        )}

        {result.error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {result.error}
          </div>
        )}

        {result.result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Hash Result</label>
            <pre className="w-full p-4 border rounded-lg font-mono bg-background overflow-auto break-all">
              {result.result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 
import { useState } from 'react';

interface EncoderResponse {
  result?: string;
  error?: string;
}

type EncodingType = 'base64' | 'url' | 'html';

export function Encoder() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<EncoderResponse>({});
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<EncodingType>('base64');

  const processText = async (action: 'encode' | 'decode') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, type: activeType }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: `Failed to ${action} text` });
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (activeType) {
      case 'base64':
        return 'encode/decode in Base64';
      case 'url':
        return 'encode/decode URL';
      case 'html':
        return 'encode/decode HTML entities';
      default:
        return 'encode/decode text';
    }
  };

  const getButtonText = (action: 'encode' | 'decode') => {
    switch (activeType) {
      case 'base64':
        return `${action === 'encode' ? 'Encode to' : 'Decode from'} Base64`;
      case 'url':
        return `${action === 'encode' ? 'Encode' : 'Decode'} URL`;
      case 'html':
        return `${action === 'encode' ? 'Encode' : 'Decode'} HTML`;
      default:
        return action;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Encoder/Decoder</h1>
      
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveType('base64')}
            className={`px-4 py-2 rounded-md ${
              activeType === 'base64'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Base64
          </button>
          <button
            onClick={() => setActiveType('url')}
            className={`px-4 py-2 rounded-md ${
              activeType === 'url'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveType('html')}
            className={`px-4 py-2 rounded-md ${
              activeType === 'html'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            HTML
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg font-mono bg-background resize-none"
            placeholder={`Enter text to ${getPlaceholder()}`}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => processText('encode')}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {getButtonText('encode')}
          </button>
          <button
            onClick={() => processText('decode')}
            disabled={loading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {getButtonText('decode')}
          </button>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Processing...</div>
        )}

        {result.error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {result.error}
          </div>
        )}

        {result.result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Result</label>
            <pre className="w-full p-4 border rounded-lg font-mono bg-background overflow-auto break-all">
              {result.result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 
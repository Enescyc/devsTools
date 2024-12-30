import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Check } from 'lucide-react';

interface TimeFormat {
  value: string;
  label: string;
}

const timeFormats: TimeFormat[] = [
  { value: 'unix', label: 'Unix Timestamp (seconds)' },
  { value: 'unix_ms', label: 'Unix Timestamp (milliseconds)' },
  { value: 'iso', label: 'ISO 8601' },
  { value: 'rfc', label: 'RFC 2822' },
  { value: 'human', label: 'Human Readable' },
];

const TimestampConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputFormat, setInputFormat] = useState<string>('unix');
  const [outputFormat, setOutputFormat] = useState<string>('iso');
  const [convertedValue, setConvertedValue] = useState<string>('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const convertTimestamp = () => {
    try {
      let date: Date;

      // Parse input based on format
      switch (inputFormat) {
        case 'unix':
          date = new Date(parseInt(inputValue) * 1000);
          break;
        case 'unix_ms':
          date = new Date(parseInt(inputValue));
          break;
        case 'iso':
          date = new Date(inputValue);
          break;
        case 'rfc':
          date = new Date(inputValue);
          break;
        case 'human':
          date = new Date(inputValue);
          break;
        default:
          throw new Error('Invalid input format');
      }

      // Format output based on selected format
      let result: string;
      switch (outputFormat) {
        case 'unix':
          result = Math.floor(date.getTime() / 1000).toString();
          break;
        case 'unix_ms':
          result = date.getTime().toString();
          break;
        case 'iso':
          result = date.toISOString();
          break;
        case 'rfc':
          result = date.toUTCString();
          break;
        case 'human':
          result = date.toLocaleString();
          break;
        default:
          throw new Error('Invalid output format');
      }

      setConvertedValue(result);
    } catch (error) {
      setConvertedValue('Invalid input');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    let value: string;

    switch (inputFormat) {
      case 'unix':
        value = Math.floor(now.getTime() / 1000).toString();
        break;
      case 'unix_ms':
        value = now.getTime().toString();
        break;
      case 'iso':
        value = now.toISOString();
        break;
      case 'rfc':
        value = now.toUTCString();
        break;
      case 'human':
        value = now.toLocaleString();
        break;
      default:
        value = '';
    }

    setInputValue(value);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Timestamp Converter</CardTitle>
          <CardDescription>
            Convert timestamps between different formats and time zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="convert">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="current">Current Time</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-format">Input Format</Label>
                  <Select value={inputFormat} onValueChange={setInputFormat}>
                    <SelectTrigger id="input-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="output-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp</Label>
                <div className="flex gap-2">
                  <Input
                    id="timestamp"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Enter ${timeFormats.find(f => f.value === inputFormat)?.label}`}
                  />
                  <Button onClick={getCurrentTimestamp} variant="outline">
                    Now
                  </Button>
                </div>
              </div>

              <Button onClick={convertTimestamp} className="w-full">
                Convert
              </Button>

              {convertedValue && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{convertedValue}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(convertedValue)}
                        className="h-8"
                      >
                        {copiedValue === convertedValue ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {timeFormats.map((format) => (
                      <div
                        key={format.value}
                        className="flex items-center justify-between border-b last:border-b-0 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{format.label}</p>
                          <code className="text-sm font-mono">
                            {(() => {
                              const now = new Date();
                              switch (format.value) {
                                case 'unix':
                                  return Math.floor(now.getTime() / 1000).toString();
                                case 'unix_ms':
                                  return now.getTime().toString();
                                case 'iso':
                                  return now.toISOString();
                                case 'rfc':
                                  return now.toUTCString();
                                case 'human':
                                  return now.toLocaleString();
                                default:
                                  return '';
                              }
                            })()}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const now = new Date();
                            let value = '';
                            switch (format.value) {
                              case 'unix':
                                value = Math.floor(now.getTime() / 1000).toString();
                                break;
                              case 'unix_ms':
                                value = now.getTime().toString();
                                break;
                              case 'iso':
                                value = now.toISOString();
                                break;
                              case 'rfc':
                                value = now.toUTCString();
                                break;
                              case 'human':
                                value = now.toLocaleString();
                                break;
                            }
                            copyToClipboard(value);
                          }}
                          className="h-8"
                        >
                          {copiedValue === (() => {
                            const now = new Date();
                            switch (format.value) {
                              case 'unix':
                                return Math.floor(now.getTime() / 1000).toString();
                              case 'unix_ms':
                                return now.getTime().toString();
                              case 'iso':
                                return now.toISOString();
                              case 'rfc':
                                return now.toUTCString();
                              case 'human':
                                return now.toLocaleString();
                              default:
                                return '';
                            }
                          })() ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimestampConverter; 
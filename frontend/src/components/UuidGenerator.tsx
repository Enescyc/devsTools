import React, { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Copy, Check, Loader2, HelpCircle } from 'lucide-react';

type UuidVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'nil';

interface UUID {
  value: string;
  version: UuidVersion;
  timestamp?: string;
}

interface ApiResponse {
  result?: string;
  results?: string[];
}

interface ValidationResponse {
  isValid: boolean;
  version?: number;
  variant?: string;
  timestamp?: string;
  isNil?: boolean;
}

interface ValidationHistoryItem extends ValidationResponse {
  uuid: string;
  timestamp: string;
}

const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<UUID[]>([]);
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [namespace, setNamespace] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [count, setCount] = useState<number>(1);
  const [startTime] = useState<string>('');
  const [uuidToValidate, setUuidToValidate] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [validationHistory, setValidationHistory] = useState<ValidationHistoryItem[]>([]);
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);

  // Reference for the scrolling container
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual list configuration
  const rowVirtualizer = useVirtualizer({
    count: uuids.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated height of each row
    overscan: 5, // Number of items to render outside of the visible area
  });

  const generateUuid = async () => {
    setIsGenerating(true);
    try {
      let endpoint = 'generate';
      if (count > 1) {
        endpoint = version === 'v1' ? 'sequential' : 'bulk';
      }

      const response = await fetch(`http://localhost:3000/api/uuid/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version,
          namespace,
          name,
          count,
          startTime: startTime || undefined,
        }),
      });
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);

      // Handle different response formats
      if (data.results) {
        // Bulk or sequential response
        setUuids(data.results.map(value => ({ value, version })));
      } else if (data.result) {
        // Single UUID response
        setUuids([{ value: data.result, version }]);
      }
    } catch (error) {
      console.error('Error generating UUID:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUuid(text);
      setTimeout(() => setCopiedUuid(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validateUuid = async () => {
    setIsValidating(true);
    setValidationError('');
    setValidationResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/uuid/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid: uuidToValidate }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate UUID');
      }

      const data: ValidationResponse = await response.json();
      setValidationResult(data);

      // Add to validation history
      setValidationHistory(prev => [{
        ...data,
        uuid: uuidToValidate,
        timestamp: new Date().toISOString(),
      }, ...prev.slice(0, 9)]); // Keep last 10 items

    } catch (error) {
      console.error('Error validating UUID:', error);
      setValidationError(error instanceof Error ? error.message : 'Failed to validate UUID');
    } finally {
      setIsValidating(false);
    }
  };

  const versionOptions: UuidVersion[] = ['v1', 'v4', 'v5', 'nil'];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>UUID Generator</CardTitle>
              <CardDescription>
                Generate and validate UUIDs with different versions and options
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="validate">Validate</TabsTrigger>
            </TabsList>
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground space-y-2 mb-4">
                    <p><strong>Version Guide:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>v1:</strong> Time-based UUID. Uses system time and hardware address.</li>
                      <li><strong>v4:</strong> Random UUID. Most common for general use.</li>
                      <li><strong>v5:</strong> Name-based UUID using SHA-1 hashing. Requires namespace and name.</li>
                      <li><strong>nil:</strong> Special UUID with all bits set to zero.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Select value={version} onValueChange={(value) => setVersion(value as UuidVersion)}>
                    <SelectTrigger id="version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              {version === 'v5' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namespace">Namespace</Label>
                    <Input
                      id="namespace"
                      value={namespace}
                      onChange={(e) => setNamespace(e.target.value)}
                      placeholder="Enter namespace UUID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                onClick={generateUuid}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate UUID'
                )}
              </Button>
              {uuids.length > 0 && (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated UUIDs ({uuids.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div ref={parentRef} className="max-h-[400px] overflow-auto rounded-md border">
                        <div
                          style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                          }}
                        >
                          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const uuid = uuids[virtualRow.index];
                            return (
                              <div
                                key={virtualRow.index}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: `${virtualRow.size}px`,
                                  transform: `translateY(${virtualRow.start}px)`,
                                }}
                              >
                                <div className="border-b last:border-b-0 hover:bg-muted/50 p-4">
                                  <div className="flex items-center justify-between">
                                    <code className="text-sm font-mono">{uuid.value}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(uuid.value)}
                                      className="h-8"
                                    >
                                      {copiedUuid === uuid.value ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  {uuid.timestamp && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Timestamp: {uuid.timestamp}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            <TabsContent value="validate" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uuid">UUID</Label>
                <Input
                  id="uuid"
                  value={uuidToValidate}
                  onChange={(e) => setUuidToValidate(e.target.value)}
                  placeholder="Enter UUID to validate"
                />
              </div>
              <Button
                className="w-full"
                onClick={validateUuid}
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate UUID'
                )}
              </Button>
              {validationResult && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${validationResult.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                          <p className="text-sm font-medium">
                            {validationResult.isValid ? 'Valid' : 'Invalid'}
                          </p>
                        </div>
                        {validationResult.isValid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(uuidToValidate)}
                            className="h-8"
                          >
                            {copiedUuid === uuidToValidate ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      {validationResult.isValid && (
                        <>
                          {validationResult.version !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              Version: v{validationResult.version}
                            </p>
                          )}
                          {validationResult.variant && (
                            <p className="text-sm text-muted-foreground">
                              Variant: {validationResult.variant}
                            </p>
                          )}
                          {validationResult.timestamp && (
                            <p className="text-sm text-muted-foreground">
                              Timestamp: {validationResult.timestamp}
                            </p>
                          )}
                          {validationResult.isNil && (
                            <p className="text-sm text-muted-foreground">
                              This is a Nil UUID
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {validationError && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-red-500 text-sm">{validationError}</div>
                  </CardContent>
                </Card>
              )}
              {validationHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Validations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {validationHistory.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b last:border-b-0 py-2"
                        >
                          <div>
                            <code className="text-sm font-mono">{item.uuid}</code>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(item.uuid)}
                              className="h-8"
                            >
                              {copiedUuid === item.uuid ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UuidGenerator; 
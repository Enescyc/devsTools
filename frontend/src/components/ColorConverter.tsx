import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Copy, Check, Pipette } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorConverter: React.FC = () => {
  const [inputFormat, setInputFormat] = useState<ColorFormat>('hex');
  const [inputValues, setInputValues] = useState<{ [key in ColorFormat]: string }>({
    hex: '#000000',
    rgb: '0, 0, 0',
    hsl: '0, 0%, 0%'
  });
  const [color, setColor] = useState<Color>({
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 }
  });
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validation functions
  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const isValidRgb = (rgb: string): boolean => {
    const parts = rgb.split(',').map(part => parseInt(part.trim()));
    return parts.length === 3 && parts.every(part => !isNaN(part) && part >= 0 && part <= 255);
  };

  const isValidHsl = (hsl: string): boolean => {
    const parts = hsl.split(',').map(part => parseFloat(part.trim().replace('%', '')));
    return parts.length === 3 &&
      !isNaN(parts[0]) && parts[0] >= 0 && parts[0] <= 360 &&
      !isNaN(parts[1]) && parts[1] >= 0 && parts[1] <= 100 &&
      !isNaN(parts[2]) && parts[2] >= 0 && parts[2] <= 100;
  };

  // Conversion functions
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result![1], 16),
      g: parseInt(result![2], 16),
      b: parseInt(result![3], 16)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  const convertColor = (value: string, from: ColorFormat) => {
    try {
      let rgb: { r: number; g: number; b: number };
      let hex: string;
      let hsl: { h: number; s: number; l: number };

      switch (from) {
        case 'hex':
          if (!isValidHex(value)) {
            throw new Error('Invalid HEX color');
          }
          rgb = hexToRgb(value);
          hex = value.toUpperCase();
          hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          break;

        case 'rgb':
          if (!isValidRgb(value)) {
            throw new Error('Invalid RGB color');
          }
          const [r, g, b] = value.split(',').map(n => parseInt(n.trim()));
          rgb = { r, g, b };
          hex = rgbToHex(r, g, b);
          hsl = rgbToHsl(r, g, b);
          break;

        case 'hsl':
          if (!isValidHsl(value)) {
            throw new Error('Invalid HSL color');
          }
          const [h, s, l] = value.split(',').map(n => parseFloat(n.trim().replace('%', '')));
          hsl = { h, s, l };
          rgb = hslToRgb(h, s, l);
          hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          break;

        default:
          throw new Error('Invalid color format');
      }

      setColor({ hex, rgb, hsl });
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleInputChange = (value: string) => {
    const newInputValues = { ...inputValues, [inputFormat]: value };
    setInputValues(newInputValues);
    convertColor(value, inputFormat);
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

  const formatColorValue = (format: ColorFormat): string => {
    switch (format) {
      case 'hex':
        return color.hex;
      case 'rgb':
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      case 'hsl':
        return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setInputFormat('hex');
    handleInputChange(hex);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Code Converter</CardTitle>
          <CardDescription>
            Convert between different color formats (HEX, RGB, HSL)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-4">
              <div className="space-y-2">
                <Label>Input Format</Label>
                <Select value={inputFormat} onValueChange={(value: ColorFormat) => setInputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">HEX</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hsl">HSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorInput">Color Value</Label>
                <Input
                  id="colorInput"
                  value={inputValues[inputFormat]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={
                    inputFormat === 'hex' ? '#000000' :
                    inputFormat === 'rgb' ? '0, 0, 0' :
                    '0, 0%, 0%'
                  }
                  className="font-mono"
                />
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Label className="flex items-center gap-2">
                  <Pipette className="h-4 w-4" />
                  Pick
                </Label>
                <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                  <Input
                    type="color"
                    value={color.hex}
                    onChange={handleColorPickerChange}
                    className="absolute top-0 left-0 w-[150%] h-[150%] cursor-pointer"
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {!error && (
            <div className="space-y-4">
              <div 
                className="h-24 rounded-lg shadow-inner" 
                style={{ backgroundColor: color.hex }}
              />
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">HEX</p>
                    <code className="text-sm font-mono">{formatColorValue('hex')}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formatColorValue('hex'))}
                  >
                    {copiedValue === formatColorValue('hex') ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">RGB</p>
                    <code className="text-sm font-mono">{formatColorValue('rgb')}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formatColorValue('rgb'))}
                  >
                    {copiedValue === formatColorValue('rgb') ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">HSL</p>
                    <code className="text-sm font-mono">{formatColorValue('hsl')}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formatColorValue('hsl'))}
                  >
                    {copiedValue === formatColorValue('hsl') ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorConverter; 
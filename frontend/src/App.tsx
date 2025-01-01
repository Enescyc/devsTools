import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { JsonFormatter } from './components/JsonFormatter';
import { TextFormatter } from './components/TextFormatter';
import { HashGenerator } from './components/HashGenerator';
import UuidGenerator from './components/UuidGenerator';
import TimestampConverter from './components/TimestampConverter';
import ColorConverter from './components/ColorConverter';
import { RegexTester } from './components/RegexTester';
import { TextDiffChecker } from './components/TextDiffChecker';
import { StringEscaper } from './components/StringEscaper';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { ThemeToggle } from './components/ui/theme-toggle';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SEO } from './components/SEO';
import { AdLayout } from './components/AdLayout';
import { monitoring } from './utils/monitoring';

function App() {
  useEffect(() => {
    // Initialize web vitals monitoring
    monitoring.measureWebVitals();

    // Track initial page view
    monitoring.trackPageView('/', 'DevToolbox - Free Developer Tools');
  }, []);

  const handleTabChange = (value: string) => {
    // Track tab changes
    monitoring.trackEvent('Navigation', 'Tab Change', value);
    monitoring.trackPageView(`/${value}`, `DevToolbox - ${value.charAt(0).toUpperCase() + value.slice(1)} Tools`);
  };

  return (
    <ThemeProvider>
      <HistoryProvider>
        <SEO />
        <AdLayout>
          <div className="bg-background text-foreground p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="DevToolbox Logo" className="w-8 h-8" />
                <h1 className="text-3xl font-bold">DevToolbox</h1>
              </div>
              <div className="flex items-center space-x-2">
                <HistoryDrawer />
                <ThemeToggle />
              </div>
            </div>
            <Tabs defaultValue="json" className="space-y-4" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="hash">Hash</TabsTrigger>
                <TabsTrigger value="uuid">UUID</TabsTrigger>
                <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
                <TabsTrigger value="color">Color</TabsTrigger>
                <TabsTrigger value="regex">Regex</TabsTrigger>
                <TabsTrigger value="diff">Diff</TabsTrigger>
              </TabsList>
              <TabsContent value="json">
                <JsonFormatter />
              </TabsContent>
              <TabsContent value="text">
                <TextFormatter />
              </TabsContent>
              <TabsContent value="hash">
                <HashGenerator />
              </TabsContent>
              <TabsContent value="uuid">
                <UuidGenerator />
              </TabsContent>
              <TabsContent value="timestamp">
                <TimestampConverter />
              </TabsContent>
              <TabsContent value="color">
                <ColorConverter />
              </TabsContent>
              <TabsContent value="regex">
                <RegexTester />
              </TabsContent>
              <TabsContent value="diff">
                <TextDiffChecker />
              </TabsContent>
            </Tabs>
            <Toaster />
          </div>
        </AdLayout>
      </HistoryProvider>
    
    </ThemeProvider>
  );
}

export default App;

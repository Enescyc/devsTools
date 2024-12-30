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

function App() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">DevTools</h1>
      <Tabs defaultValue="json" className="space-y-4">
        <TabsList>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="hash">Hash</TabsTrigger>
          <TabsTrigger value="uuid">UUID</TabsTrigger>
          <TabsTrigger value="timestamp">Timestamp</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="regex">Regex</TabsTrigger>
          <TabsTrigger value="diff">Diff</TabsTrigger>
          <TabsTrigger value="string">String</TabsTrigger>
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
        <TabsContent value="string">
          <StringEscaper />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}

export default App;

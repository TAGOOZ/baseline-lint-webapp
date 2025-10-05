import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  onAnalyze: (code: string, language: string) => void;
  isAnalyzing: boolean;
}

export default function CodeEditor({ onAnalyze, isAnalyzing }: CodeEditorProps) {
  const [cssCode, setCssCode] = useState(`/* Modern CSS Example */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  container-type: inline-size;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1.5rem;
}

.text {
  word-break: auto-phrase;
}`);

  const [jsCode, setJsCode] = useState(`// Modern JavaScript Example
const data = [1, 2, 3, 4, 5];

// Array methods
const last = data.at(-1);
const doubled = data.map(x => x * 2);
const sorted = data.toSorted((a, b) => b - a);

// Promise handling
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
]);

// Object operations
const grouped = Object.groupBy(data, n => n % 2 === 0 ? 'even' : 'odd');
const hasOwn = Object.hasOwn(grouped, 'even');

console.log({ last, doubled, sorted, results, grouped });`);

  const [activeTab, setActiveTab] = useState("css");
  const { toast } = useToast();

  const handleAnalyze = () => {
    const code = activeTab === "css" ? cssCode : jsCode;
    console.log('Analyzing code:', { code, language: activeTab });
    onAnalyze(code, activeTab);
  };

  const handleClear = () => {
    if (activeTab === "css") {
      setCssCode("");
    } else {
      setJsCode("");
    }
    console.log('Cleared code');
  };

  const handleCopy = async () => {
    const code = activeTab === "css" ? cssCode : jsCode;
    await navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  return (
    <div className="w-full" id="editor-section">
      <div className="border border-border rounded-lg bg-card overflow-hidden shadow-terminal">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" data-testid="dot-red"></div>
            <div className="w-3 h-3 rounded-full bg-chart-2" data-testid="dot-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-chart-1" data-testid="dot-green"></div>
          </div>
          <span className="text-xs text-muted-foreground font-mono" data-testid="text-window-title">
            baseline-lint-terminal.app
          </span>
          <div className="w-16"></div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border bg-muted/30">
            <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent" data-testid="tabs-language">
              <TabsTrigger 
                value="css" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                data-testid="tab-css"
              >
                CSS
              </TabsTrigger>
              <TabsTrigger 
                value="js" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                data-testid="tab-javascript"
              >
                JavaScript
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="css" className="m-0 p-0" data-testid="content-css">
            <Editor
              height="300px"
              className="sm:h-[400px]"
              language="css"
              value={cssCode}
              onChange={(value) => setCssCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </TabsContent>

          <TabsContent value="js" className="m-0 p-0" data-testid="content-javascript">
            <Editor
              height="300px"
              className="sm:h-[400px]"
              language="javascript"
              value={jsCode}
              onChange={(value) => setJsCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3 bg-muted/30 border-t border-border">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="gap-2 flex-1 sm:flex-none min-h-[44px]"
              data-testid="button-analyze"
            >
              <Play className="w-4 h-4" />
              <span>{isAnalyzing ? "Analyzing..." : "Check"}</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear}
              className="gap-2 flex-1 sm:flex-none min-h-[44px]"
              data-testid="button-clear"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCopy}
              className="gap-2 flex-1 sm:flex-none min-h-[44px]"
              data-testid="button-copy"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </Button>
          </div>
          <div className="sm:ml-auto flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" data-testid="status-indicator"></div>
            <span className="text-xs sm:text-sm text-muted-foreground font-mono" data-testid="text-status">
              {isAnalyzing ? "Analyzing..." : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

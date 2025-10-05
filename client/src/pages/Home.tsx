import { useState } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import HeroSection from "@/components/HeroSection";
import CodeEditor from "@/components/CodeEditor";
import ResultsPanel from "@/components/ResultsPanel";
import ExamplesSection from "@/components/ExamplesSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality
const analyzeMockCode = (code: string, language: string) => {
  const mockIssues = [];
  
  if (language === 'css') {
    if (code.includes('container-type')) {
      mockIssues.push({
        id: '1',
        feature: 'container-type: inline-size',
        status: 'newly-available' as const,
        line: code.split('\n').findIndex(l => l.includes('container-type')) + 1,
        column: 3,
        message: 'CSS Container Queries are newly available across modern browsers',
        recommendation: 'Use with caution. Consider providing fallbacks for older browsers.',
        since: '2023-02-14'
      });
    }
    
    if (code.includes('word-break: auto-phrase')) {
      mockIssues.push({
        id: '2',
        feature: 'word-break: auto-phrase',
        status: 'limited' as const,
        line: code.split('\n').findIndex(l => l.includes('word-break')) + 1,
        column: 3,
        message: 'This feature has limited browser support',
        recommendation: 'Avoid using this feature or provide polyfills for better compatibility.',
      });
    }
    
    if (code.includes('display: grid')) {
      mockIssues.push({
        id: '3',
        feature: 'display: grid',
        status: 'widely-available' as const,
        line: code.split('\n').findIndex(l => l.includes('display: grid')) + 1,
        column: 3,
        message: 'CSS Grid is widely supported across all modern browsers',
        since: '2017-03-07'
      });
    }
  } else if (language === 'js') {
    if (code.includes('.at(')) {
      mockIssues.push({
        id: '4',
        feature: 'Array.prototype.at',
        status: 'newly-available' as const,
        line: code.split('\n').findIndex(l => l.includes('.at(')) + 1,
        column: 12,
        message: 'Array.at() is newly available in modern browsers',
        recommendation: 'Consider using traditional array indexing for broader compatibility.',
        since: '2022-03-14'
      });
    }
    
    if (code.includes('Promise.allSettled')) {
      mockIssues.push({
        id: '5',
        feature: 'Promise.allSettled',
        status: 'widely-available' as const,
        line: code.split('\n').findIndex(l => l.includes('Promise.allSettled')) + 1,
        column: 18,
        message: 'Promise.allSettled is widely supported across all modern browsers',
        since: '2020-08-10'
      });
    }
    
    if (code.includes('Object.groupBy')) {
      mockIssues.push({
        id: '6',
        feature: 'Object.groupBy',
        status: 'limited' as const,
        line: code.split('\n').findIndex(l => l.includes('Object.groupBy')) + 1,
        column: 18,
        message: 'Object.groupBy has limited browser support',
        recommendation: 'Use a polyfill or manual grouping implementation for better compatibility.',
      });
    }
  }
  
  const widelyAvailable = mockIssues.filter(i => i.status === 'widely-available').length;
  const newlyAvailable = mockIssues.filter(i => i.status === 'newly-available').length;
  const limited = mockIssues.filter(i => i.status === 'limited').length;
  
  const score = Math.round(
    ((widelyAvailable * 1.0 + newlyAvailable * 0.7 + limited * 0.0) / 
    Math.max(mockIssues.length, 1)) * 100
  );
  
  return { score: mockIssues.length > 0 ? score : 100, issues: mockIssues };
};

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ score: number; issues: any[] } | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("css");
  const { toast } = useToast();

  const handleAnalyze = async (code: string, language: string) => {
    setIsAnalyzing(true);
    setCurrentCode(code);
    setCurrentLanguage(language);
    
    //todo: remove mock functionality - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysisResults = analyzeMockCode(code, language);
    setResults(analysisResults);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Found ${analysisResults.issues.length} compatibility ${analysisResults.issues.length === 1 ? 'issue' : 'issues'}`,
    });
    
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLoadExample = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    
    const editorSection = document.getElementById('editor-section');
    if (editorSection) {
      editorSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    toast({
      title: "Example Loaded",
      description: `${language.toUpperCase()} example has been loaded into the editor`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary)) 2px, hsl(var(--primary)) 3px)',
        }}
      />
      
      <div className="relative z-10">
        <TerminalHeader />
        <HeroSection />
        
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <CodeEditor onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          
          <div id="results-section">
            {results && (
              <ResultsPanel 
                score={results.score} 
                issues={results.issues} 
                isVisible={true} 
              />
            )}
          </div>
        </section>
        
        <ExamplesSection onLoadExample={handleLoadExample} />
        <Footer />
      </div>
    </div>
  );
}

import { useState } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import HeroSection from "@/components/HeroSection";
import CodeEditor from "@/components/CodeEditor";
import ResultsPanel from "@/components/ResultsPanel";
import ExamplesSection from "@/components/ExamplesSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

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
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const analysisResults = await response.json();
      setResults(analysisResults);
      
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
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
        
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <CodeEditor 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing}
            externalCode={currentCode}
            externalLanguage={currentLanguage}
          />
          
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

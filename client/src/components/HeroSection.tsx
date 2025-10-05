import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Check Browser Compatibility // Real-time Analysis";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToEditor = () => {
    const editorSection = document.getElementById('editor-section');
    if (editorSection) {
      editorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary)) 2px, hsl(var(--primary)) 4px)',
        }}
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <pre className="hidden sm:inline-block text-xs md:text-sm lg:text-base text-primary font-mono" data-testid="text-ascii-logo">
{`
██████   █████  ███████ ███████ ██      ██ ███    ██ ███████ 
██   ██ ██   ██ ██      ██      ██      ██ ████   ██ ██      
██████  ███████ ███████ █████   ██      ██ ██ ██  ██ █████   
██   ██ ██   ██      ██ ██      ██      ██ ██  ██ ██ ██      
██████  ██   ██ ███████ ███████ ███████ ██ ██   ████ ███████ 
`}
          </pre>
          <div className="sm:hidden">
            <h1 className="text-3xl font-bold text-primary font-mono mb-2" data-testid="text-mobile-logo">
              BASELINE
            </h1>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-foreground" data-testid="text-subtitle">
          LINT TERMINAL
        </h2>
        
        <div className="h-12 sm:h-8 mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-mono px-2" data-testid="text-tagline">
            <span className="text-primary">&gt;</span> {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={scrollToEditor}
          className="group relative overflow-visible w-full sm:w-auto"
          data-testid="button-launch"
        >
          <span className="relative z-10">Launch Terminal</span>
        </Button>
        
        <div className="mt-16 animate-bounce">
          <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground" data-testid="icon-scroll" />
        </div>
      </div>
    </section>
  );
}

import { Terminal, Github, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TerminalHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" data-testid="icon-terminal" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground" data-testid="text-title">
              <span className="text-primary">&gt;</span> baseline-lint<span className="animate-pulse">_</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary border border-primary/30 rounded" data-testid="badge-beta">
              BETA
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              data-testid="link-npm"
            >
              <a 
                href="https://www.npmjs.com/package/baseline-lint" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">npm</span>
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              data-testid="link-github"
            >
              <a 
                href="https://github.com/TAGOOZ/baseline-lint" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Github, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Trophy className="w-4 h-4 text-chart-2" />
            <span data-testid="text-hackathon">
              Built for the{" "}
              <a 
                href="https://baseline-tooling-hackathon.devpost.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-hackathon"
              >
                Baseline Tooling Hackathon
              </a>
              {" "}by Google Chrome
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild data-testid="button-github">
              <a 
                href="https://github.com/TAGOOZ/baseline-lint" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Star on GitHub</span>
              </a>
            </Button>
            <span className="text-xs text-muted-foreground font-mono" data-testid="text-license">
              MIT License
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-mono" data-testid="text-copyright">
            <span className="text-primary">&gt;</span> baseline-lint v1.0.6
            <span className="mx-2">•</span>
            Check browser compatibility instantly
          </p>
        </div>
      </div>
    </footer>
  );
}

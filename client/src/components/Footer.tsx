import { Github, Trophy, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-mono text-center md:text-left">
            <Trophy className="w-4 h-4 text-chart-2 flex-shrink-0" />
            <span data-testid="text-hackathon" className="leading-tight">
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

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="default" asChild data-testid="button-github" className="w-full sm:w-auto min-h-[44px]">
              <a 
                href="https://github.com/TAGOOZ/baseline-lint" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">Star on GitHub</span>
              </a>
            </Button>
            <span className="text-xs text-muted-foreground font-mono" data-testid="text-license">
              MIT License
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Button variant="ghost" size="default" asChild data-testid="button-profile-github" className="min-h-[44px]">
                <a 
                  href="https://github.com/TAGOOZ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">@TAGOOZ</span>
                </a>
              </Button>
              <Button variant="ghost" size="default" asChild data-testid="button-profile-linkedin" className="min-h-[44px]">
                <a 
                  href="https://www.linkedin.com/in/tagooz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </Button>
              <Button variant="ghost" size="default" asChild data-testid="button-profile-email" className="min-h-[44px]">
                <a 
                  href="mailto:mostafatagedleen588@gmail.com"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-mono text-center px-4" data-testid="text-copyright">
              <span className="text-primary">&gt;</span> baseline-lint v1.0.7
              <span className="mx-2">•</span>
              Check browser compatibility instantly
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

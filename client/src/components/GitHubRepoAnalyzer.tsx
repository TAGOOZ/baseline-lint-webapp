import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, ArrowRight, Loader2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createApiUrl } from "@/config/api";

interface GitHubRepoAnalyzerProps {
  onAnalysisComplete: (results: any) => void;
}

const SUGGESTED_REPOS = [
  { name: "facebook/react", description: "A JavaScript library for building user interfaces" },
  { name: "vuejs/core", description: "Vue.js is a progressive framework" },
  { name: "twbs/bootstrap", description: "The most popular HTML, CSS, and JS library" },
  { name: "tailwindlabs/tailwindcss", description: "A utility-first CSS framework" },
  { name: "axios/axios", description: "Promise based HTTP client" },
  { name: "lodash/lodash", description: "A modern JavaScript utility library" },
];

export default function GitHubRepoAnalyzer({ onAnalysisComplete }: GitHubRepoAnalyzerProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<{ filesProcessed: number; totalFiles: number; timeElapsed: number } | null>(null);
  const { toast } = useToast();

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
      }
    }
    return null;
  };

  const handleAnalyze = async () => {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL or owner/repo format",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress({ filesProcessed: 0, totalFiles: 0, timeElapsed: 0 });
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      setProgress(prev => prev ? { ...prev, timeElapsed: Math.floor((Date.now() - startTime) / 1000) } : null);
    }, 1000);

    try {
      const response = await fetch(createApiUrl('api/analyze-repo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: parsed.owner, repo: parsed.repo }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      const results = await response.json();
      clearInterval(progressInterval);
      
      setProgress({
        filesProcessed: results.filesAnalyzed,
        totalFiles: results.totalFiles,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
      });

      toast({
        title: "Repository Analysis Complete",
        description: `Analyzed ${results.filesAnalyzed} files in ${Math.floor((Date.now() - startTime) / 1000)}s`,
      });

      onAnalysisComplete(results);
    } catch (error: any) {
      clearInterval(progressInterval);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze repository",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSuggestedRepo = (repoName: string) => {
    setRepoUrl(repoName);
  };

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Github className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold font-mono text-primary mb-2" data-testid="text-github-title">
              Analyze GitHub Repository
            </h2>
            <p className="text-sm text-muted-foreground font-mono mb-4" data-testid="text-github-description">
              Enter a repository URL to analyze all JavaScript and CSS files for browser compatibility issues
            </p>

            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded border border-border">
              <Info className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground font-mono" data-testid="text-limits">
                Limits: Max 50 files, 100KB per file. Rate limited to 5 requests/minute.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="text"
                placeholder="https://github.com/owner/repo or owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isAnalyzing}
                className="flex-1 font-mono"
                data-testid="input-repo-url"
                onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && handleAnalyze()}
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !repoUrl.trim()}
                className="gap-2 min-h-[44px]"
                data-testid="button-analyze-repo"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Repository
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {progress && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded font-mono text-sm space-y-1" data-testid="text-progress">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files Processed:</span>
                  <span className="text-primary font-bold">{progress.filesProcessed} / {progress.totalFiles || '?'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Elapsed:</span>
                  <span className="text-primary font-bold">{progress.timeElapsed}s</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-mono text-muted-foreground mb-3" data-testid="text-suggested-title">
                Popular repositories to try:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_REPOS.map((repo) => (
                  <Badge
                    key={repo.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20 transition-colors py-2 px-3"
                    onClick={() => loadSuggestedRepo(repo.name)}
                    data-testid={`badge-suggested-${repo.name.replace('/', '-')}`}
                    title={repo.description}
                  >
                    <Github className="w-3 h-3 mr-1" />
                    {repo.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

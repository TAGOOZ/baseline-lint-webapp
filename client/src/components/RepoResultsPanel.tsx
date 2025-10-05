import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCode, AlertTriangle, CheckCircle2, Github } from "lucide-react";

interface RepoResultsPanelProps {
  results: {
    repository: string;
    totalFiles: number;
    filesAnalyzed: number;
    filesWithIssues: number;
    totalIssues: number;
    fileResults: Array<{
      path: string;
      language: string;
      score: number;
      issueCount: number;
      issues: Array<{
        feature: string;
        status: string;
        message: string;
        location?: any;
      }>;
    }>;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'widely-available':
      return 'text-green-500';
    case 'newly-available':
      return 'text-yellow-500';
    default:
      return 'text-red-500';
  }
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'widely-available':
      return 'default';
    case 'newly-available':
      return 'secondary';
    default:
      return 'destructive';
  }
};

export default function RepoResultsPanel({ results }: RepoResultsPanelProps) {
  const overallScore = results.filesAnalyzed > 0
    ? Math.round((results.filesAnalyzed - results.filesWithIssues) / results.filesAnalyzed * 100)
    : 100;

  return (
    <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm p-4 sm:p-6 mt-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Github className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold font-mono text-primary mb-2" data-testid="text-repo-results-title">
              Repository Analysis Results
            </h2>
            <p className="text-sm text-muted-foreground font-mono mb-4" data-testid="text-repo-name">
              {results.repository}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground font-mono mb-1">Total Files</div>
                <div className="text-2xl font-bold font-mono text-primary" data-testid="text-total-files">
                  {results.totalFiles}
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground font-mono mb-1">Analyzed</div>
                <div className="text-2xl font-bold font-mono text-primary" data-testid="text-files-analyzed">
                  {results.filesAnalyzed}
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground font-mono mb-1">With Issues</div>
                <div className="text-2xl font-bold font-mono text-destructive" data-testid="text-files-with-issues">
                  {results.filesWithIssues}
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground font-mono mb-1">Score</div>
                <div className="text-2xl font-bold font-mono text-primary" data-testid="text-overall-score">
                  {overallScore}%
                </div>
              </div>
            </div>

            {results.filesWithIssues === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded" data-testid="text-no-issues">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold font-mono text-green-500 mb-1">All Clear!</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    No compatibility issues found in the analyzed files.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold font-mono text-foreground" data-testid="text-issues-found">
                    {results.totalIssues} compatibility {results.totalIssues === 1 ? 'issue' : 'issues'} found in {results.filesWithIssues} {results.filesWithIssues === 1 ? 'file' : 'files'}
                  </h3>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {results.fileResults.map((file, idx) => (
                    <AccordionItem key={idx} value={`file-${idx}`} className="border border-border rounded mb-2 px-4">
                      <AccordionTrigger className="hover:no-underline" data-testid={`accordion-file-${idx}`}>
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <FileCode className="w-4 h-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm truncate">{file.path}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {file.language.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {file.issueCount} {file.issueCount === 1 ? 'issue' : 'issues'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-3">
                          {file.issues.map((issue, issueIdx) => (
                            <div
                              key={issueIdx}
                              className="border-l-2 border-primary/50 pl-4 py-2"
                              data-testid={`issue-${idx}-${issueIdx}`}
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <Badge variant={getStatusBadgeVariant(issue.status)} className="mt-0.5">
                                  {issue.status}
                                </Badge>
                                <code className="text-sm font-mono text-primary flex-1">
                                  {issue.feature}
                                </code>
                              </div>
                              <p className="text-sm text-muted-foreground font-mono">
                                {issue.message}
                              </p>
                              {issue.location && (
                                <p className="text-xs text-muted-foreground font-mono mt-1">
                                  Line {issue.location.start?.line || '?'}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

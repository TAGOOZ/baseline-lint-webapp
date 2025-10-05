import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CompatibilityIssue {
  id: string;
  feature: string;
  status: 'widely-available' | 'newly-available' | 'limited';
  line?: number;
  column?: number;
  message: string;
  recommendation?: string;
  since?: string;
}

interface ResultsPanelProps {
  score: number;
  issues: CompatibilityIssue[];
  isVisible: boolean;
}

export default function ResultsPanel({ score, issues, isVisible }: ResultsPanelProps) {
  if (!isVisible) return null;

  const safeIssues = issues || [];
  const newlyAvailable = safeIssues.filter(i => i.status === 'newly-available');
  const limited = safeIssues.filter(i => i.status === 'limited');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'widely-available':
        return <CheckCircle2 className="w-4 h-4 text-chart-1" />;
      case 'newly-available':
        return <AlertTriangle className="w-4 h-4 text-chart-2" />;
      case 'limited':
        return <XCircle className="w-4 h-4 text-chart-3" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'widely-available': 'default',
      'newly-available': 'secondary',
      'limited': 'destructive',
    } as const;
    
    const labels = {
      'widely-available': 'Widely Available',
      'newly-available': 'Newly Available',
      'limited': 'Limited',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="w-full mt-8" data-testid="results-panel">
      <Card className="border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground" data-testid="text-results-title">
              Compatibility Analysis
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary" data-testid="text-score">
                {score}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <Progress value={score} className="h-2" data-testid="progress-score" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 border-b border-border bg-card">
          <div className="text-center" data-testid="stat-newly-available">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-chart-2" />
              <span className="text-2xl font-bold text-chart-2">{newlyAvailable.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">NEWLY AVAILABLE</p>
          </div>
          <div className="text-center" data-testid="stat-limited">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-chart-3" />
              <span className="text-2xl font-bold text-chart-3">{limited.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">LIMITED</p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full" data-testid="accordion-issues">
            {safeIssues.map((issue) => (
              <AccordionItem key={issue.id} value={issue.id} className="border-border">
                <AccordionTrigger className="hover:no-underline py-4 min-h-[44px]" data-testid={`accordion-trigger-${issue.id}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-left flex-1 pr-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {getStatusIcon(issue.status)}
                      <code className="text-sm font-mono flex-1" data-testid={`text-feature-${issue.id}`}>
                        {issue.feature}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 ml-7 sm:ml-0 flex-wrap">
                      {issue.line && (
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap" data-testid={`text-location-${issue.id}`}>
                          Line {issue.line}:{issue.column}
                        </span>
                      )}
                      {getStatusBadge(issue.status)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7 sm:pl-10 pr-2 sm:pr-4 pb-3 space-y-2">
                    <p className="text-sm text-muted-foreground" data-testid={`text-message-${issue.id}`}>
                      {issue.message}
                    </p>
                    {issue.since && (
                      <p className="text-xs text-muted-foreground font-mono" data-testid={`text-since-${issue.id}`}>
                        Available since: {issue.since}
                      </p>
                    )}
                    {issue.recommendation && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border">
                        <p className="text-xs font-semibold text-foreground mb-1">Recommendation:</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-recommendation-${issue.id}`}>
                          {issue.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {safeIssues.length === 0 && (
            <div className="text-center py-8" data-testid="text-no-issues">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-muted-foreground font-mono">
                No compatibility concerns found. All features have good browser support!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

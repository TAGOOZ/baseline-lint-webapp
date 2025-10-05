import * as baselineLint from 'baseline-lint';

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

interface AnalysisResult {
  score: number;
  issues: CompatibilityIssue[];
}

function convertBaselineLintIssues(baselineIssues: any[]): CompatibilityIssue[] {
  return baselineIssues.map((issue, index) => {
    let status: 'widely-available' | 'newly-available' | 'limited' = 'limited';
    
    if (issue.baseline === 'high') {
      status = 'widely-available';
    } else if (issue.baseline === 'low') {
      status = 'newly-available';
    } else {
      status = 'limited';
    }

    let featureName = issue.api || issue.property || issue.feature || issue.featureId || issue.name;
    
    if (featureName && issue.value) {
      featureName = `${featureName}: ${issue.value}`;
    }
    
    if (!featureName && issue.message) {
      const match = issue.message.match(/Feature:\s*([^\s]+)|['"`]([^'"`]+)['"`]/);
      if (match) {
        featureName = match[1] || match[2];
      }
    }
    
    if (!featureName) {
      featureName = 'Unspecified feature';
    }

    return {
      id: String(index),
      feature: featureName,
      status,
      line: issue.line,
      column: issue.column,
      message: issue.message || '',
      recommendation: issue.suggestion,
      since: issue.since,
    };
  });
}

export async function analyzeCode(code: string, language: string): Promise<AnalysisResult> {
  try {
    let result: any;
    
    if (language === 'css') {
      result = await (baselineLint as any).analyzeCSSContent(code, {});
    } else if (language === 'js' || language === 'javascript') {
      result = await (baselineLint as any).analyzeJSContent(code, {});
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }

    const issues = convertBaselineLintIssues(result.issues || []);
    
    const score = calculateCompatibilityScore(issues);

    return {
      score,
      issues,
    };
  } catch (error) {
    console.error('Baseline-lint analysis error:', error);
    throw error;
  }
}

function calculateCompatibilityScore(issues: CompatibilityIssue[]): number {
  if (issues.length === 0) return 100;

  const weights = {
    'widely-available': 1.0,
    'newly-available': 0.6,
    'limited': 0.2,
  };

  const totalWeight = issues.reduce((sum, issue) => {
    return sum + weights[issue.status];
  }, 0);

  return Math.round((totalWeight / issues.length) * 100);
}

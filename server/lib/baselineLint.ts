import * as cssTree from 'css-tree';
import { parse as babelParse } from '@babel/parser';
import traverse from '@babel/traverse';
const { features } = require('web-features');
const { computeBaseline } = require('compute-baseline');

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

function getBaselineStatus(featureId: string): { status: string; since?: string } | null {
  const feature = features[featureId];
  if (!feature || !feature.status?.baseline) return null;

  const baseline = feature.status.baseline;
  
  if (baseline === 'high') {
    return { status: 'widely-available', since: feature.status.baseline_high_date };
  } else if (baseline === 'low') {
    return { status: 'newly-available', since: feature.status.baseline_low_date };
  } else {
    return { status: 'limited' };
  }
}

function analyzeCSSCode(code: string): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  let issueId = 0;

  try {
    const ast = cssTree.parse(code, {
      positions: true,
      parseAtrulePrelude: false,
      parseCustomProperty: false,
    });

    cssTree.walk(ast, {
      visit: 'Declaration',
      enter: (node: any) => {
        const property = node.property;
        const value = cssTree.generate(node.value);
        
        const featureMappings: Record<string, string> = {
          'container-type': 'container-queries',
          'container-name': 'container-queries',
          'display': value.includes('grid') ? 'grid' : value.includes('flex') ? 'flexbox' : '',
          'gap': 'gap',
          'word-break': value.includes('auto-phrase') ? 'word-break-auto-phrase' : '',
        };

        const featureId = featureMappings[property];
        if (featureId) {
          const baselineInfo = getBaselineStatus(featureId);
          if (baselineInfo) {
            const statusMap = {
              'widely-available': 'Widely available across all modern browsers',
              'newly-available': 'Newly available - use with caution',
              'limited': 'Limited browser support - avoid or use polyfills',
            };

            const recommendationMap = {
              'widely-available': 'Safe to use in production.',
              'newly-available': 'Consider providing fallbacks for older browsers.',
              'limited': 'Avoid using this feature or provide comprehensive polyfills.',
            };

            issues.push({
              id: String(issueId++),
              feature: `${property}: ${value}`,
              status: baselineInfo.status as any,
              line: node.loc?.start.line,
              column: node.loc?.start.column,
              message: statusMap[baselineInfo.status as keyof typeof statusMap],
              recommendation: recommendationMap[baselineInfo.status as keyof typeof recommendationMap],
              since: baselineInfo.since,
            });
          }
        }
      },
    });

    cssTree.walk(ast, {
      visit: 'PseudoClassSelector',
      enter: (node: any) => {
        const pseudoClass = node.name;
        const featureMap: Record<string, string> = {
          'has': 'has',
          'is': 'is',
          'where': 'where',
        };

        const featureId = featureMap[pseudoClass];
        if (featureId) {
          const baselineInfo = getBaselineStatus(`:${featureId}`);
          if (baselineInfo) {
            issues.push({
              id: String(issueId++),
              feature: `:${pseudoClass}`,
              status: baselineInfo.status as any,
              line: node.loc?.start.line,
              column: node.loc?.start.column,
              message: `Pseudo-class :${pseudoClass} - ${baselineInfo.status.replace('-', ' ')}`,
              since: baselineInfo.since,
            });
          }
        }
      },
    });
  } catch (error) {
    console.error('CSS parsing error:', error);
  }

  return issues;
}

function analyzeJSCode(code: string): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  let issueId = 0;

  try {
    const ast = babelParse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
      MemberExpression(path: any) {
        const object = path.node.object;
        const property = path.node.property;

        if (object.type === 'Identifier' && property.type === 'Identifier') {
          const apiCall = `${object.name}.${property.name}`;
          
          const featureMap: Record<string, string> = {
            'Promise.allSettled': 'promise-allsettled',
            'Promise.any': 'promise-any',
            'Object.hasOwn': 'object-hasown',
            'Object.groupBy': 'object-groupby',
            'Object.fromEntries': 'object-fromentries',
          };

          const featureId = featureMap[apiCall];
          if (featureId) {
            const baselineInfo = getBaselineStatus(featureId);
            if (baselineInfo) {
              issues.push({
                id: String(issueId++),
                feature: apiCall,
                status: baselineInfo.status as any,
                line: path.node.loc?.start.line,
                column: path.node.loc?.start.column,
                message: `${apiCall} - ${baselineInfo.status.replace('-', ' ')}`,
                since: baselineInfo.since,
              });
            }
          }
        }
      },
      CallExpression(path: any) {
        const callee = path.node.callee;
        
        if (callee.type === 'MemberExpression') {
          const object = callee.object;
          const property = callee.property;

          if (property.type === 'Identifier' && property.name === 'at') {
            const baselineInfo = getBaselineStatus('array-at');
            if (baselineInfo) {
              issues.push({
                id: String(issueId++),
                feature: 'Array.prototype.at',
                status: baselineInfo.status as any,
                line: path.node.loc?.start.line,
                column: path.node.loc?.start.column,
                message: 'Array.at() method - newly available',
                recommendation: 'Consider using traditional array indexing for broader compatibility.',
                since: baselineInfo.since,
              });
            }
          }

          if (property.type === 'Identifier' && property.name === 'toSorted') {
            issues.push({
              id: String(issueId++),
              feature: 'Array.prototype.toSorted',
              status: 'newly-available',
              line: path.node.loc?.start.line,
              column: path.node.loc?.start.column,
              message: 'Array.toSorted() method - newly available',
              recommendation: 'Use Array.prototype.sort() for wider compatibility.',
            });
          }
        }
      },
    });
  } catch (error) {
    console.error('JS parsing error:', error);
  }

  return issues;
}

function calculateScore(issues: CompatibilityIssue[]): number {
  if (issues.length === 0) return 100;

  const weights = {
    'widely-available': 1.0,
    'newly-available': 0.7,
    'limited': 0.0,
  };

  const totalWeight = issues.reduce((sum, issue) => {
    return sum + weights[issue.status];
  }, 0);

  return Math.round((totalWeight / issues.length) * 100);
}

export function analyzeCode(code: string, language: string): AnalysisResult {
  let issues: CompatibilityIssue[] = [];

  if (language === 'css') {
    issues = analyzeCSSCode(code);
  } else if (language === 'js' || language === 'javascript') {
    issues = analyzeJSCode(code);
  }

  const score = calculateScore(issues);

  return { score, issues };
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

interface Example {
  id: string;
  title: string;
  description: string;
  language: 'css' | 'js';
  code: string;
}

interface ExamplesSectionProps {
  onLoadExample: (code: string, language: string) => void;
}

export default function ExamplesSection({ onLoadExample }: ExamplesSectionProps) {
  const examples: Example[] = [
    {
      id: 'modern-css',
      title: 'Modern CSS',
      description: 'Container queries, grid, and modern properties',
      language: 'css',
      code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  container-type: inline-size;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1.5rem;
}

.text {
  word-break: auto-phrase;
}`
    },
    {
      id: 'flexbox',
      title: 'Flexbox Layout',
      description: 'Widely supported flexbox properties',
      language: 'css',
      code: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 300px;
  padding: 1rem;
}`
    },
    {
      id: 'es6-features',
      title: 'ES6+ Features',
      description: 'Modern JavaScript array and promise methods',
      language: 'js',
      code: `const data = [1, 2, 3, 4, 5];

// Array methods
const last = data.at(-1);
const doubled = data.map(x => x * 2);
const sorted = data.toSorted((a, b) => b - a);

// Promise handling
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
]);

console.log({ last, doubled, sorted });`
    },
    {
      id: 'object-methods',
      title: 'Object Methods',
      description: 'Modern object manipulation APIs',
      language: 'js',
      code: `const data = { a: 1, b: 2, c: 3 };

// Object methods
const entries = Object.entries(data);
const hasOwn = Object.hasOwn(data, 'a');
const grouped = Object.groupBy([1,2,3,4], n => n % 2 ? 'odd' : 'even');

// New methods
const frozen = Object.freeze({ ...data });
const result = Object.fromEntries(entries);

console.log({ hasOwn, grouped, result });`
    },
    {
      id: 'css-pseudo',
      title: 'CSS Pseudo-classes',
      description: 'Modern pseudo-class selectors',
      language: 'css',
      code: `.container:has(> .active) {
  background: var(--accent);
}

.item:is(.selected, .focused) {
  border-color: var(--primary);
}

.nav-item:where(.active, .current) {
  font-weight: bold;
}`
    },
    {
      id: 'web-apis',
      title: 'Web APIs',
      description: 'Browser APIs and modern features',
      language: 'js',
      code: `// Performance API
const perfEntry = performance.now();

// Crypto API
const uuid = crypto.randomUUID();

// Navigator API
const online = navigator.onLine;
const lang = navigator.language;

// Location API
const url = new URL(location.href);
const params = url.searchParams;

console.log({ perfEntry, uuid, online, lang });`
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-examples-title">
          <span className="text-primary">&gt;</span> Code Examples
        </h2>
        <p className="text-muted-foreground font-mono text-sm" data-testid="text-examples-subtitle">
          Click to load and analyze example code snippets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example) => (
          <Card 
            key={example.id} 
            className="p-6 hover-elevate transition-all duration-200 relative overflow-visible"
            data-testid={`card-example-${example.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground" data-testid={`text-example-title-${example.id}`}>
                  {example.title}
                </h3>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-mono" data-testid={`badge-language-${example.id}`}>
                {example.language.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]" data-testid={`text-example-desc-${example.id}`}>
              {example.description}
            </p>
            
            <pre className="text-xs bg-background/50 p-3 rounded border border-border overflow-x-auto mb-4 font-mono" data-testid={`code-preview-${example.id}`}>
              <code className="text-muted-foreground">
                {example.code.split('\n').slice(0, 3).join('\n')}
                {example.code.split('\n').length > 3 ? '\n...' : ''}
              </code>
            </pre>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                console.log('Loading example:', example.title);
                onLoadExample(example.code, example.language);
              }}
              data-testid={`button-load-${example.id}`}
            >
              Load Example
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

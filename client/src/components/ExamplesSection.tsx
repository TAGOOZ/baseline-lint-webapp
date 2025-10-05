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
      id: 'react-hooks',
      title: 'React Hooks',
      description: 'Real code from React repository (useState, useEffect)',
      language: 'js',
      code: `// From facebook/react
function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  
  return { count, increment, decrement };
}

// Promise.allSettled for concurrent fetches
const data = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
]);`
    },
    {
      id: 'vue-reactivity',
      title: 'Vue Reactivity',
      description: 'Real code from Vue.js repository',
      language: 'js',
      code: `// From vuejs/core
const state = reactive({ count: 0 });

// Object.hasOwn usage
const hasProperty = Object.hasOwn(state, 'count');

// Array.at for negative indexing
const items = ['a', 'b', 'c'];
const lastItem = items.at(-1);

// Promise.any for race conditions
const first = await Promise.any([
  fetch('/api/v1'),
  fetch('/api/v2')
]);`
    },
    {
      id: 'lodash-array',
      title: 'Lodash Methods',
      description: 'Real utility patterns from lodash library',
      language: 'js',
      code: `// From lodash/lodash
function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Modern alternatives
const groups = Object.groupBy([1,2,3,4], n => n % 2);
const entries = Object.fromEntries([['a', 1], ['b', 2]]);`
    },
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
      id: 'css-pseudo',
      title: 'CSS Pseudo-classes',
      description: 'Modern pseudo-class selectors (:has, :is, :where)',
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
      id: 'edge-case-empty',
      title: 'Edge Case: Empty',
      description: 'Testing empty code (should return 100 score)',
      language: 'js',
      code: ``
    },
    {
      id: 'edge-case-legacy',
      title: 'Edge Case: Legacy',
      description: 'Old ES5 code (should score perfectly)',
      language: 'js',
      code: `var data = [1, 2, 3, 4, 5];
var doubled = [];

for (var i = 0; i < data.length; i++) {
  doubled.push(data[i] * 2);
}

console.log(doubled);`
    },
    {
      id: 'edge-case-bleeding',
      title: 'Edge Case: Bleeding',
      description: 'Newest features (should score lower)',
      language: 'js',
      code: `// Very new features
const arr = [1, 2, 3, 4, 5];
const sorted = arr.toSorted();
const last = arr.at(-1);

// Newer Object methods
const grouped = Object.groupBy(arr, n => n % 2);
const hasKey = Object.hasOwn({a: 1}, 'a');

// Latest Promise methods
const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(2)
]);`
    },
    {
      id: 'edge-case-mixed',
      title: 'Edge Case: Mixed',
      description: 'Mix of old and new (varied compatibility)',
      language: 'css',
      code: `/* Old widely supported */
.box {
  display: flex;
  justify-content: center;
}

/* Newly available */
.container:has(.item) {
  padding: 1rem;
}

/* Limited availability */
.text {
  word-break: auto-phrase;
}`
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-examples-title">
          <span className="text-primary">&gt;</span> Code Examples
        </h2>
        <p className="text-muted-foreground font-mono text-xs sm:text-sm px-4" data-testid="text-examples-subtitle">
          Click to load and analyze example code snippets
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {examples.map((example) => (
          <Card 
            key={example.id} 
            className="p-4 sm:p-6 hover-elevate transition-all duration-200 relative overflow-visible"
            data-testid={`card-example-${example.id}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Code2 className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground" data-testid={`text-example-title-${example.id}`}>
                  {example.title}
                </h3>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-mono whitespace-nowrap flex-shrink-0" data-testid={`badge-language-${example.id}`}>
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
              size="default" 
              className="w-full min-h-[44px]"
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

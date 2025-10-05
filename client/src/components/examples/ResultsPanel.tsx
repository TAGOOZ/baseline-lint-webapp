import ResultsPanel from '../ResultsPanel'

export default function ResultsPanelExample() {
  const mockIssues = [
    {
      id: '1',
      feature: 'container-type: inline-size',
      status: 'newly-available' as const,
      line: 5,
      column: 3,
      message: 'CSS Container Queries are newly available across modern browsers',
      recommendation: 'Use with caution. Consider providing fallbacks for older browsers.',
      since: '2023-02-14'
    },
    {
      id: '2',
      feature: 'word-break: auto-phrase',
      status: 'limited' as const,
      line: 14,
      column: 3,
      message: 'This feature has limited browser support',
      recommendation: 'Avoid using this feature or provide polyfills for better compatibility.',
    },
    {
      id: '3',
      feature: 'display: grid',
      status: 'widely-available' as const,
      line: 2,
      column: 3,
      message: 'CSS Grid is widely supported across all modern browsers',
      since: '2017-03-07'
    }
  ];

  return (
    <div className="p-8">
      <ResultsPanel score={87} issues={mockIssues} isVisible={true} />
    </div>
  )
}

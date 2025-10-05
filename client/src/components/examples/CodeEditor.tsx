import CodeEditor from '../CodeEditor'

export default function CodeEditorExample() {
  return (
    <div className="p-8">
      <CodeEditor 
        onAnalyze={(code, lang) => console.log('Analyze:', code, lang)} 
        isAnalyzing={false} 
      />
    </div>
  )
}

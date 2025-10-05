import ExamplesSection from '../ExamplesSection'

export default function ExamplesSectionExample() {
  return (
    <ExamplesSection 
      onLoadExample={(code, lang) => console.log('Load example:', code, lang)} 
    />
  )
}

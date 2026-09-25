import { useEffect, useState } from 'react'
import { parseGraphJson, stringifyGraphJson } from '../jsonFormat'
import type { StoryGraph } from '../types'

type Props = {
  graph: StoryGraph
  onApply: (graph: StoryGraph) => void
}

export function JsonPanel({ graph, onApply }: Props) {
  const [text, setText] = useState(() => stringifyGraphJson(graph))
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) setText(stringifyGraphJson(graph))
  }, [graph, dirty])

  const apply = () => {
    try {
      const next = parseGraphJson(text)
      onApply(next)
      setError(null)
      setDirty(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON نامعتبر است')
    }
  }

  return (
    <section className="json-panel">
      <div className="section-head">
        <h2>JSON</h2>
        <div className="row">
          {dirty && <span className="pill warn">ویرایش‌شده</span>}
          <button type="button" className="btn btn-small" onClick={apply}>
            اعمال JSON
          </button>
        </div>
      </div>
      <textarea
        className="json-editor"
        spellCheck={false}
        dir="ltr"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setDirty(true)
          setError(null)
        }}
      />
      {error && <p className="error">{error}</p>}
    </section>
  )
}

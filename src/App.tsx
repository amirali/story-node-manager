import { useCallback, useState } from 'react'
import { GraphCanvas } from './components/GraphCanvas'
import { JsonPanel } from './components/JsonPanel'
import { Sidebar } from './components/Sidebar'
import { applyFlowPositions, removeNode, stringifyGraphJson } from './graph'
import { sampleGraph } from './sample'
import { createId, emptyGraph, type Choice, type StoryGraph } from './types'
import './App.css'

export default function App() {
  const [graph, setGraph] = useState<StoryGraph>(sampleGraph)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(sampleGraph.start)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(true)

  const addNode = () => {
    const id = createId('node')
    const node = {
      id,
      title: 'گره جدید',
      text: '',
      position: {
        x: 120 + graph.nodes.length * 40,
        y: 80 + graph.nodes.length * 36,
      },
      choices: [] as Choice[],
    }
    setGraph({ ...graph, nodes: [...graph.nodes, node] })
    setSelectedNodeId(id)
    setSelectedChoiceId(null)
  }

  const onPositionsChange = useCallback((positions: Record<string, { x: number; y: number }>) => {
    setGraph((g) => applyFlowPositions(g, positions))
  }, [])

  const onConnectChoice = useCallback(
    (sourceNodeId: string, choiceId: string, targetNodeId: string) => {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id !== sourceNodeId
            ? n
            : {
                ...n,
                choices: n.choices.map((c) =>
                  c.id === choiceId ? { ...c, target: targetNodeId } : c,
                ),
              },
        ),
      }))
    },
    [],
  )

  const onDeleteNode = (id: string) => {
    setGraph((g) => removeNode(g, id))
    setSelectedNodeId(null)
    setSelectedChoiceId(null)
  }

  const download = () => {
    const blob = new Blob([stringifyGraphJson(graph)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'story-graph.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <h1>مدیر گره</h1>
            <p>گراف داستان · گره‌ها · انتخاب‌ها · پیوندها</p>
          </div>
        </div>

        <div className="topbar__actions">
          <button type="button" className="btn" onClick={addNode}>
            + افزودن گره
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setGraph(sampleGraph)}>
            نمونه
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const g = emptyGraph()
              setGraph(g)
              setSelectedNodeId(g.start)
              setSelectedChoiceId(null)
            }}
          >
            گراف جدید
          </button>
          <button type="button" className="btn btn-ghost" onClick={download}>
            خروجی JSON
          </button>
          <button
            type="button"
            className={`btn btn-ghost${showJson ? ' is-on' : ''}`}
            onClick={() => setShowJson((v) => !v)}
          >
            {showJson ? 'پنهان کردن JSON' : 'نمایش JSON'}
          </button>
        </div>
      </header>

      <main className={`workspace${showJson ? ' with-json' : ''}`}>
        <GraphCanvas
          graph={graph}
          selectedNodeId={selectedNodeId}
          selectedChoiceId={selectedChoiceId}
          onSelectNode={setSelectedNodeId}
          onSelectChoice={setSelectedChoiceId}
          onPositionsChange={onPositionsChange}
          onConnectChoice={onConnectChoice}
        />
        <Sidebar
          graph={graph}
          selectedNodeId={selectedNodeId}
          selectedChoiceId={selectedChoiceId}
          onChange={setGraph}
          onSelectChoice={setSelectedChoiceId}
          onDeleteNode={onDeleteNode}
        />
        {showJson && <JsonPanel graph={graph} onApply={setGraph} />}
      </main>
    </div>
  )
}

import { createId, type Choice, type StoryGraph, type StoryNode } from '../types'

type Props = {
  graph: StoryGraph
  selectedNodeId: string | null
  selectedChoiceId: string | null
  onChange: (graph: StoryGraph) => void
  onSelectChoice: (id: string | null) => void
  onDeleteNode: (id: string) => void
}

export function Sidebar({
  graph,
  selectedNodeId,
  selectedChoiceId,
  onChange,
  onSelectChoice,
  onDeleteNode,
}: Props) {
  const node = graph.nodes.find((n) => n.id === selectedNodeId) ?? null

  if (!node) {
    return (
      <aside className="sidebar">
        <h2>بازرس</h2>
        <p className="muted">یک گره را روی گراف انتخاب کنید تا متن، انتخاب‌ها و پیوندهایش را ویرایش کنید.</p>
        <div className="hint-block">
          <p>
            از دستگیرهٔ هر <strong>انتخاب</strong> به گرهٔ دیگر بکشید تا رابطه بسازید.
          </p>
          <p>
            <strong>شکل JSON:</strong> کلیدها انگلیسی‌اند — <code>start</code>، <code>nodes</code>،{' '}
            <code>choices</code>؛ هر انتخاب با <code>target</code> به شناسهٔ گره بعدی اشاره می‌کند.
          </p>
        </div>
      </aside>
    )
  }

  const updateNode = (patch: Partial<StoryNode>) => {
    onChange({
      ...graph,
      nodes: graph.nodes.map((n) => (n.id === node.id ? { ...n, ...patch } : n)),
    })
  }

  const updateChoice = (choiceId: string, patch: Partial<Choice>) => {
    updateNode({
      choices: node.choices.map((c) => (c.id === choiceId ? { ...c, ...patch } : c)),
    })
  }

  const addChoice = () => {
    const choice: Choice = {
      id: createId('انتخاب'),
      label: 'انتخاب جدید',
      target: '',
    }
    updateNode({ choices: [...node.choices, choice] })
    onSelectChoice(choice.id)
  }

  const removeChoice = (choiceId: string) => {
    updateNode({ choices: node.choices.filter((c) => c.id !== choiceId) })
    if (selectedChoiceId === choiceId) onSelectChoice(null)
  }

  const otherNodes = graph.nodes.filter((n) => n.id !== node.id)

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <h2>گره</h2>
        {graph.start === node.id ? (
          <span className="pill">شروع</span>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onChange({ ...graph, start: node.id })}
          >
            تنظیم به‌عنوان شروع
          </button>
        )}
      </div>

      <label className="field">
        <span>شناسه</span>
        <input value={node.id} disabled dir="ltr" />
      </label>

      <label className="field">
        <span>عنوان</span>
        <input
          value={node.title}
          onChange={(e) => updateNode({ title: e.target.value })}
          placeholder="عنوان گره"
        />
      </label>

      <label className="field">
        <span>متن</span>
        <textarea
          value={node.text}
          onChange={(e) => updateNode({ text: e.target.value })}
          rows={4}
          placeholder="در این گره چه اتفاقی می‌افتد…"
        />
      </label>

      <div className="section-head">
        <h3>انتخاب‌ها</h3>
        <button type="button" className="btn btn-small" onClick={addChoice}>
          + افزودن انتخاب
        </button>
      </div>

      {node.choices.length === 0 && (
        <p className="muted">هنوز انتخابی نیست. یکی اضافه کنید، سپس دستگیره‌اش را به گرهٔ مقصد بکشید.</p>
      )}

      <ul className="choice-list">
        {node.choices.map((choice) => (
          <li
            key={choice.id}
            className={`choice-card${selectedChoiceId === choice.id ? ' is-active' : ''}`}
            onClick={() => onSelectChoice(choice.id)}
          >
            <label className="field">
              <span>برچسب</span>
              <input
                value={choice.label}
                onChange={(e) => updateChoice(choice.id, { label: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              />
            </label>

            <label className="field">
              <span>منتهی می‌شود به</span>
              <select
                value={choice.target}
                onChange={(e) => updateChoice(choice.id, { target: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">— بدون پیوند —</option>
                {otherNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title || n.id}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={(e) => {
                e.stopPropagation()
                removeChoice(choice.id)
              }}
            >
              حذف انتخاب
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-danger block"
        disabled={graph.nodes.length <= 1}
        onClick={() => onDeleteNode(node.id)}
      >
        حذف گره
      </button>
    </aside>
  )
}

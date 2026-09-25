import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { StoryNodeData } from '../graph'

export function StoryNodeView({ data, selected }: NodeProps & { data: StoryNodeData }) {
  return (
    <div className={`story-node${selected ? ' is-selected' : ''}${data.isStart ? ' is-start' : ''}`}>
      <Handle type="target" position={Position.Right} className="node-handle" />

      <header className="story-node__header">
        {data.isStart && <span className="story-node__badge">شروع</span>}
        <h3>{data.title || 'بدون عنوان'}</h3>
      </header>

      <p className="story-node__text">{data.text || 'هنوز متنی نوشته نشده.'}</p>

      {data.choices.length > 0 && (
        <ul className="story-node__choices">
          {data.choices.map((choice) => (
            <li
              key={choice.id}
              className={data.selectedChoiceId === choice.id ? 'is-active' : undefined}
            >
              <span className="choice-label">{choice.label || 'انتخاب بدون عنوان'}</span>
              <Handle
                type="source"
                position={Position.Left}
                id={choice.id}
                className="choice-handle"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

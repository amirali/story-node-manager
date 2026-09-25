import type { Edge, Node } from '@xyflow/react'
import type { StoryGraph, StoryNode } from './types'

export type StoryNodeData = {
  title: string
  text: string
  choices: StoryGraph['nodes'][number]['choices']
  isStart: boolean
  selectedChoiceId: string | null
}

export function graphToFlow(graph: StoryGraph, selectedChoiceId: string | null = null): {
  nodes: Node<StoryNodeData>[]
  edges: Edge[]
} {
  const nodes: Node<StoryNodeData>[] = graph.nodes.map((n) => ({
    id: n.id,
    type: 'story',
    position: n.position,
    data: {
      title: n.title,
      text: n.text,
      choices: n.choices,
      isStart: n.id === graph.start,
      selectedChoiceId,
    },
  }))

  const edges: Edge[] = []
  for (const node of graph.nodes) {
    for (const choice of node.choices) {
      if (!choice.target) continue
      const exists = graph.nodes.some((n) => n.id === choice.target)
      if (!exists) continue
      edges.push({
        id: `e_${choice.id}`,
        source: node.id,
        sourceHandle: choice.id,
        target: choice.target,
        label: choice.label,
        type: 'smoothstep',
        animated: selectedChoiceId === choice.id,
        className: selectedChoiceId === choice.id ? 'edge-active' : undefined,
      })
    }
  }

  return { nodes, edges }
}

export function applyFlowPositions(
  graph: StoryGraph,
  positions: Record<string, { x: number; y: number }>,
): StoryGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((n) =>
      positions[n.id] ? { ...n, position: positions[n.id] } : n,
    ),
  }
}

export function upsertNode(graph: StoryGraph, node: StoryNode): StoryGraph {
  const idx = graph.nodes.findIndex((n) => n.id === node.id)
  if (idx === -1) return { ...graph, nodes: [...graph.nodes, node] }
  const nodes = [...graph.nodes]
  nodes[idx] = node
  return { ...graph, nodes }
}

export function removeNode(graph: StoryGraph, nodeId: string): StoryGraph {
  const nodes = graph.nodes
    .filter((n) => n.id !== nodeId)
    .map((n) => ({
      ...n,
      choices: n.choices.map((c) =>
        c.target === nodeId ? { ...c, target: '' } : c,
      ),
    }))

  let start = graph.start
  if (start === nodeId) start = nodes[0]?.id ?? ''

  return { start, nodes }
}

export { parseGraphJson, stringifyGraphJson } from './jsonFormat'

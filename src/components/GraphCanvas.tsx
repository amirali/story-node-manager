import { useCallback, useEffect, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type OnSelectionChangeParams,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { graphToFlow, type StoryNodeData } from '../graph'
import type { StoryGraph } from '../types'
import { StoryNodeView } from './StoryNodeView'

const nodeTypes = { story: StoryNodeView }

type Props = {
  graph: StoryGraph
  selectedNodeId: string | null
  selectedChoiceId: string | null
  onSelectNode: (id: string | null) => void
  onSelectChoice: (id: string | null) => void
  onPositionsChange: (positions: Record<string, { x: number; y: number }>) => void
  onConnectChoice: (sourceNodeId: string, choiceId: string, targetNodeId: string) => void
}

export function GraphCanvas({
  graph,
  selectedNodeId,
  selectedChoiceId,
  onSelectNode,
  onSelectChoice,
  onPositionsChange,
  onConnectChoice,
}: Props) {
  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () => graphToFlow(graph, selectedChoiceId),
    [graph, selectedChoiceId],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  useEffect(() => {
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [flowNodes, flowEdges, setNodes, setEdges])

  const onNodeDragStop = useCallback(
    (_event: unknown, _node: Node, all: Node[]) => {
      const positions: Record<string, { x: number; y: number }> = {}
      for (const n of all) positions[n.id] = n.position
      onPositionsChange(positions)
    },
    [onPositionsChange],
  )

  const onSelectionChange = useCallback(
    ({ nodes: selected }: OnSelectionChangeParams) => {
      const id = selected[0]?.id ?? null
      onSelectNode(id)
      if (!id) onSelectChoice(null)
    },
    [onSelectNode, onSelectChoice],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.sourceHandle || !connection.target) return
      onConnectChoice(connection.source, connection.sourceHandle, connection.target)
      onSelectChoice(connection.sourceHandle)
    },
    [onConnectChoice, onSelectChoice],
  )

  return (
    <div className="graph-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesFocusable
        edgesFocusable
        selectionOnDrag={false}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#5b6e5e', strokeWidth: 1.5 },
          labelStyle: { fill: '#3d4a40', fontSize: 11, fontWeight: 500 },
          labelBgStyle: { fill: '#f3f1eb', fillOpacity: 0.92 },
          labelBgPadding: [4, 6] as [number, number],
          labelBgBorderRadius: 4,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="#c9c4b8" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as StoryNodeData
            if (d?.isStart) return '#2f6f4e'
            if (n.id === selectedNodeId) return '#c45c26'
            return '#8a9184'
          }}
          maskColor="rgba(243, 241, 235, 0.7)"
        />
      </ReactFlow>
    </div>
  )
}

export type Choice = {
  id: string
  label: string
  /** Node id this choice leads to. Empty string = unlinked. */
  target: string
}

export type StoryNode = {
  id: string
  title: string
  text: string
  position: { x: number; y: number }
  choices: Choice[]
}

export type StoryGraph = {
  /** Entry node id */
  start: string
  nodes: StoryNode[]
}

export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function emptyGraph(): StoryGraph {
  const id = createId('گره')
  return {
    start: id,
    nodes: [
      {
        id,
        title: 'شروع',
        text: 'متن آغاز را اینجا بنویس.',
        position: { x: 80, y: 120 },
        choices: [],
      },
    ],
  }
}

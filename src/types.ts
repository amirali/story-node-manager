/** An item or resource referenced by slug. */
export type ItemAmount = {
  slug: string
  quantity: number
}

export type Conditions = {
  items: ItemAmount[]
  resources: ItemAmount[]
  /** Achievement slugs. */
  achievements: string[]
}

export function emptyConditions(): Conditions {
  return { items: [], resources: [], achievements: [] }
}

export type Choice = {
  id: string
  label: string
  /** Node id this choice leads to. Empty string = unlinked. */
  target: string
  /** What the player must have to pick this choice. */
  requirements: Conditions
  /** Text shown after picking the choice, before the next node. */
  response: string
  /** Changes applied on pick; negative quantity = spend/lose, achievements are granted. */
  effects: Conditions
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
  const id = createId('node')
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

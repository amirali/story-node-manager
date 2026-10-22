import type { Choice, Conditions, ItemAmount, StoryGraph, StoryNode } from './types'

function parseItemAmounts(raw: unknown, where: string): ItemAmount[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) throw new Error(`${where} must be an array`)
  return raw.map((rawItem, i) => {
    const item = (rawItem ?? {}) as Record<string, unknown>
    if (typeof item.slug !== 'string' || !item.slug) {
      throw new Error(`${where}[${i}] needs a slug`)
    }
    if (typeof item.quantity !== 'number' || !Number.isFinite(item.quantity)) {
      throw new Error(`${where}[${i}] needs a numeric quantity`)
    }
    return { slug: item.slug, quantity: item.quantity }
  })
}

function parseConditions(raw: unknown, where: string): Conditions {
  if (raw === undefined) return { items: [], resources: [], achievements: [] }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`${where} must be an object with items, resources and achievements`)
  }
  const c = raw as Record<string, unknown>
  const achievements = c.achievements ?? []
  if (!Array.isArray(achievements) || achievements.some((a) => typeof a !== 'string' || !a)) {
    throw new Error(`${where}.achievements must be an array of slugs`)
  }
  return {
    items: parseItemAmounts(c.items, `${where}.items`),
    resources: parseItemAmounts(c.resources, `${where}.resources`),
    achievements,
  }
}

export function stringifyGraphJson(graph: StoryGraph): string {
  return JSON.stringify(graph, null, 2)
}

export function parseGraphJson(raw: string): StoryGraph {
  const data = JSON.parse(raw) as Record<string, unknown>
  if (!data || typeof data !== 'object') throw new Error('Root must be an object')

  if (!Array.isArray(data.nodes)) throw new Error('Missing nodes array')
  if (typeof data.start !== 'string') throw new Error('Missing start id')

  const nodes: StoryNode[] = data.nodes.map((rawNode, index) => {
    if (!rawNode || typeof rawNode !== 'object') {
      throw new Error(`Node at index ${index} must be an object`)
    }
    const n = rawNode as Record<string, unknown>
    if (typeof n.id !== 'string' || !n.id) {
      throw new Error(`Node at index ${index} needs an id`)
    }

    const pos =
      n.position && typeof n.position === 'object'
        ? (n.position as Record<string, unknown>)
        : { x: 0, y: 0 }

    const choicesRaw = Array.isArray(n.choices) ? n.choices : []
    const choices: Choice[] = choicesRaw.map((rawChoice, cIndex) => {
      if (!rawChoice || typeof rawChoice !== 'object') {
        throw new Error(`Choice ${cIndex} in node «${n.id}» must be an object`)
      }
      const c = rawChoice as Record<string, unknown>
      if (typeof c.id !== 'string' || !c.id) {
        throw new Error(`Choice ${cIndex} in node «${n.id}» needs an id`)
      }
      return {
        id: c.id,
        label: typeof c.label === 'string' ? c.label : 'Choice',
        target: typeof c.target === 'string' ? c.target : '',
        requirements: parseConditions(c.requirements, `Choice «${c.id}» requirements`),
        response: typeof c.response === 'string' ? c.response : '',
        effects: parseConditions(c.effects, `Choice «${c.id}» effects`),
      }
    })

    return {
      id: n.id,
      title: typeof n.title === 'string' ? n.title : n.id,
      text: typeof n.text === 'string' ? n.text : '',
      position: {
        x: typeof pos.x === 'number' ? pos.x : 0,
        y: typeof pos.y === 'number' ? pos.y : 0,
      },
      choices,
    }
  })

  return { start: data.start, nodes }
}

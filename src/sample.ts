import type { StoryGraph } from './types'

export const sampleGraph: StoryGraph = {
  start: 'crossroads',
  nodes: [
    {
      id: 'crossroads',
      title: 'دوراهی',
      text: 'در دوراهی ایستاده‌ای. مه روی درخت‌ها نشسته است.',
      position: { x: 80, y: 160 },
      choices: [
        { id: 'to_forest', label: 'مسیر جنگل را برو', target: 'dense_forest', requirements: { items: [{ slug: 'torch', quantity: 1 }], resources: [], achievements: [] }, response: 'مشعل را روشن می‌کنی و وارد جنگل می‌شوی.', effects: { items: [{ slug: 'torch', quantity: -1 }], resources: [], achievements: ['forest_explorer'] } },
        { id: 'to_village', label: 'به سوی روستا برو', target: 'quiet_village', requirements: { items: [], resources: [], achievements: [] }, response: '', effects: { items: [], resources: [{ slug: 'gold', quantity: 5 }], achievements: [] } },
      ],
    },
    {
      id: 'dense_forest',
      title: 'جنگل انبوه',
      text: 'آواز پرندگان کم می‌شود. چیزی در بوته‌ها جابه‌جا می‌شود.',
      position: { x: 420, y: 40 },
      choices: [
        { id: 'listen', label: 'با دقت گوش بده', target: 'clearing', requirements: { items: [], resources: [], achievements: [] }, response: '', effects: { items: [], resources: [], achievements: [] } },
        { id: 'go_back', label: 'برگرد', target: 'crossroads', requirements: { items: [], resources: [], achievements: [] }, response: '', effects: { items: [], resources: [], achievements: [] } },
      ],
    },
    {
      id: 'quiet_village',
      title: 'روستای خاموش',
      text: 'کرکره‌ها بسته‌اند. تنها یک فانوس کنار چاه روشن است.',
      position: { x: 420, y: 280 },
      choices: [
        { id: 'approach_well', label: 'نزدیک چاه شو', target: 'clearing', requirements: { items: [], resources: [], achievements: [] }, response: '', effects: { items: [], resources: [], achievements: [] } },
        { id: 'knock_door', label: 'به دری بکوب', target: 'crossroads', requirements: { items: [], resources: [], achievements: [] }, response: '', effects: { items: [], resources: [], achievements: [] } },
      ],
    },
    {
      id: 'clearing',
      title: 'پاکسازی مهتابی',
      text: 'هر دو مسیر اینجا به هم می‌رسند. داستان ادامه دارد…',
      position: { x: 760, y: 160 },
      choices: [],
    },
  ],
}

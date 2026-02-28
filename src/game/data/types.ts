export interface EnemyData {
  id: string
  name: string
  hp: number
  damage: number
  speed: number
  xp: number
  loot: LootEntry[]
  weakness: string
  description: string
  color: number
  size: number
  aiType: 'melee' | 'ranged' | 'patrol' | 'boss'
}

export interface LootEntry {
  itemId: string
  chance: number
  quantity: [number, number]
}

export interface ItemData {
  id: string
  name: string
  description: string
  type: 'weapon' | 'armor' | 'potion' | 'ingredient' | 'oil' | 'bomb' | 'quest' | 'misc'
  value: number
  stackable: boolean
  maxStack?: number
  effect?: ItemEffect
  stats?: Partial<PlayerStats>
}

export interface ItemEffect {
  type: 'heal' | 'buff' | 'damage'
  value: number
  duration?: number
  stat?: string
}

export interface PlayerStats {
  maxHp: number
  maxStamina: number
  maxSignEnergy: number
  attack: number
  defense: number
  speed: number
}

export interface QuestData {
  id: string
  title: string
  description: string
  type: 'main' | 'contract' | 'side'
  stages: QuestStage[]
  rewards: QuestReward
}

export interface QuestStage {
  id: string
  description: string
  objective: QuestObjective
}

export interface QuestObjective {
  type: 'kill' | 'collect' | 'talk' | 'reach' | 'deliver'
  target: string
  count: number
  current?: number
  zoneId?: string
}

export interface QuestReward {
  xp: number
  gold: number
  items?: string[]
}

export interface DialogueNode {
  id: string
  speaker: string
  text: string
  options?: DialogueOption[]
  action?: DialogueAction
}

export interface DialogueOption {
  text: string
  next?: string
  condition?: string
  action?: DialogueAction
}

export interface DialogueAction {
  type: 'start_quest' | 'complete_quest' | 'give_item' | 'set_flag' | 'open_shop' | 'open_board'
  value?: string
}

export interface DialogueTree {
  id: string
  npcId: string
  nodes: DialogueNode[]
  startNode: string
}

export interface BestiaryEntry {
  id: string
  name: string
  category: string
  description: string
  lore: string
  weaknesses: string[]
  resistances: string[]
  tips: string
  unlocked: boolean
}

export interface ZoneDef {
  id: string
  name: string
  width: number
  height: number
  tileSize: number
  ambientColor: number
  tiles: number[][]
  enemySpawns: SpawnPoint[]
  npcSpawns: SpawnPoint[]
  exits: ZoneExit[]
  itemSpawns: ItemSpawn[]
}

export interface SpawnPoint {
  x: number
  y: number
  id: string
  respawnTime?: number
}

export interface ZoneExit {
  x: number
  y: number
  width: number
  height: number
  targetZone: string
  targetX: number
  targetY: number
  label: string
}

export interface ItemSpawn {
  x: number
  y: number
  itemId: string
  quantity: number
}

export interface AlchemyRecipe {
  id: string
  name: string
  ingredients: Record<string, number>
  result: string
  resultQuantity: number
  description: string
}

export interface ShopInventory {
  npcId: string
  items: ShopItem[]
}

export interface ShopItem {
  itemId: string
  quantity: number
  price: number
}

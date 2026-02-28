import { create } from 'zustand'
import type { BestiaryEntry } from '../game/data/types'
import { BESTIARY } from '../game/data/bestiary'
import { QUESTS } from '../game/data/quests'

export interface InventorySlot {
  itemId: string
  quantity: number
}

export interface Equipment {
  weapon: string | null
  armor: string | null
  oil: string | null
}

export interface PlayerState {
  name: string
  level: number
  xp: number
  xpToNext: number
  hp: number
  maxHp: number
  stamina: number
  maxStamina: number
  signEnergy: number
  maxSignEnergy: number
  attack: number
  defense: number
  speed: number
  gold: number
}

export interface QuestProgress {
  questId: string
  currentStage: number
  stageProgress: Record<string, number>
  completed: boolean
}

export interface ActiveDialogue {
  treeId: string
  currentNodeId: string
}

export interface GameFlags {
  [key: string]: boolean | number | string
}

export type UIScreen = 'none' | 'inventory' | 'questlog' | 'bestiary' | 'alchemy' | 'shop' | 'board' | 'dialogue' | 'death' | 'mainmenu' | 'gameover'

export interface ShopState {
  npcId: string
  items: Array<{ itemId: string; quantity: number; price: number }>
}

interface GameState {
  // Core state
  phase: 'menu' | 'playing' | 'paused' | 'dead'
  currentZone: string
  dayTime: number          // 0-1, 0=midnight, 0.5=noon
  dayCount: number

  // Player
  player: PlayerState
  inventory: InventorySlot[]
  equipment: Equipment

  // Quests
  activeQuests: QuestProgress[]
  completedQuestIds: string[]

  // Bestiary
  bestiary: Record<string, BestiaryEntry>

  // UI
  activeScreen: UIScreen
  activeDialogue: ActiveDialogue | null
  shopState: ShopState | null
  notification: string | null

  // World flags
  flags: GameFlags

  // Actions
  setPhase: (phase: GameState['phase']) => void
  setZone: (zoneId: string) => void
  advanceTime: (delta: number) => void

  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  spendStamina: (amount: number) => boolean
  regenStamina: (amount: number) => void
  spendSignEnergy: (amount: number) => boolean
  regenSignEnergy: (amount: number) => void

  gainXp: (amount: number) => void
  gainGold: (amount: number) => void
  spendGold: (amount: number) => boolean

  addItem: (itemId: string, quantity: number) => void
  removeItem: (itemId: string, quantity: number) => boolean
  hasItem: (itemId: string, quantity?: number) => boolean
  equipItem: (slot: keyof Equipment, itemId: string | null) => void
  usePotion: (itemId: string) => void

  startQuest: (questId: string) => void
  advanceQuest: (questId: string, stageId: string, amount?: number) => void
  completeQuest: (questId: string) => void
  isQuestActive: (questId: string) => boolean
  isQuestCompleted: (questId: string) => boolean
  getQuestStageProgress: (questId: string, stageId: string) => number

  unlockBestiaryEntry: (enemyId: string) => void

  openScreen: (screen: UIScreen) => void
  closeScreen: () => void
  openDialogue: (treeId: string) => void
  setDialogueNode: (nodeId: string) => void
  closeDialogue: () => void
  openShop: (npcId: string, items: ShopState['items']) => void
  closeShop: () => void
  showNotification: (message: string) => void
  clearNotification: () => void

  setFlag: (key: string, value: boolean | number | string) => void
  getFlag: (key: string) => boolean | number | string | undefined

  resetGame: () => void
}

const initialPlayer: PlayerState = {
  name: '灰烬猎者',
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100,
  signEnergy: 80,
  maxSignEnergy: 80,
  attack: 15,
  defense: 5,
  speed: 160,
  gold: 50,
}

const initialInventory: InventorySlot[] = [
  { itemId: 'steel_sword', quantity: 1 },
  { itemId: 'leather_armor', quantity: 1 },
  { itemId: 'healing_potion', quantity: 3 },
  { itemId: 'moonflower', quantity: 3 },
  { itemId: 'red_berry', quantity: 3 },
]

const initialEquipment: Equipment = {
  weapon: 'steel_sword',
  armor: 'leather_armor',
  oil: null,
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  currentZone: 'zone_village',
  dayTime: 0.5,
  dayCount: 1,

  player: { ...initialPlayer },
  inventory: [...initialInventory],
  equipment: { ...initialEquipment },

  activeQuests: [],
  completedQuestIds: [],

  bestiary: JSON.parse(JSON.stringify(BESTIARY)),

  activeScreen: 'mainmenu',
  activeDialogue: null,
  shopState: null,
  notification: null,

  flags: {},

  setPhase: (phase) => set({ phase }),
  setZone: (zoneId) => set({ currentZone: zoneId }),

  advanceTime: (delta) => {
    set((state) => {
      const newTime = (state.dayTime + delta / 240) % 1
      const newDay = state.dayCount + (newTime < state.dayTime ? 1 : 0)
      return { dayTime: newTime, dayCount: newDay }
    })
  },

  takeDamage: (amount) => {
    set((state) => {
      const defense = state.player.defense
      const actual = Math.max(1, amount - defense)
      const newHp = Math.max(0, state.player.hp - actual)
      const dead = newHp <= 0
      return {
        player: { ...state.player, hp: newHp },
        phase: dead ? 'dead' : state.phase,
        activeScreen: dead ? 'death' : state.activeScreen,
      }
    })
  },

  heal: (amount) => {
    set((state) => ({
      player: { ...state.player, hp: Math.min(state.player.maxHp, state.player.hp + amount) },
    }))
  },

  spendStamina: (amount) => {
    const { player } = get()
    if (player.stamina < amount) return false
    set((state) => ({ player: { ...state.player, stamina: state.player.stamina - amount } }))
    return true
  },

  regenStamina: (amount) => {
    set((state) => ({
      player: { ...state.player, stamina: Math.min(state.player.maxStamina, state.player.stamina + amount) },
    }))
  },

  spendSignEnergy: (amount) => {
    const { player } = get()
    if (player.signEnergy < amount) return false
    set((state) => ({ player: { ...state.player, signEnergy: state.player.signEnergy - amount } }))
    return true
  },

  regenSignEnergy: (amount) => {
    set((state) => ({
      player: { ...state.player, signEnergy: Math.min(state.player.maxSignEnergy, state.player.signEnergy + amount) },
    }))
  },

  gainXp: (amount) => {
    set((state) => {
      let { xp, xpToNext, level, maxHp, maxStamina, maxSignEnergy, attack, defense } = state.player
      xp += amount
      while (xp >= xpToNext) {
        xp -= xpToNext
        level++
        xpToNext = Math.floor(xpToNext * 1.4)
        maxHp += 20
        maxStamina += 10
        maxSignEnergy += 8
        attack += 3
        defense += 2
      }
      return {
        player: { ...state.player, xp, xpToNext, level, maxHp, maxStamina, maxSignEnergy, attack, defense, hp: state.player.hp + 20 },
        notification: `升级！当前等级 ${level}`,
      }
    })
  },

  gainGold: (amount) => {
    set((state) => ({ player: { ...state.player, gold: state.player.gold + amount } }))
  },

  spendGold: (amount) => {
    const { player } = get()
    if (player.gold < amount) return false
    set((state) => ({ player: { ...state.player, gold: state.player.gold - amount } }))
    return true
  },

  addItem: (itemId, quantity) => {
    set((state) => {
      const inv = [...state.inventory]
      const existing = inv.find((s) => s.itemId === itemId)
      if (existing) {
        existing.quantity += quantity
      } else {
        inv.push({ itemId, quantity })
      }
      return { inventory: inv }
    })
  },

  removeItem: (itemId, quantity) => {
    const { inventory } = get()
    const slot = inventory.find((s) => s.itemId === itemId)
    if (!slot || slot.quantity < quantity) return false
    set((state) => {
      const inv = state.inventory
        .map((s) => s.itemId === itemId ? { ...s, quantity: s.quantity - quantity } : s)
        .filter((s) => s.quantity > 0)
      return { inventory: inv }
    })
    return true
  },

  hasItem: (itemId, quantity = 1) => {
    const slot = get().inventory.find((s) => s.itemId === itemId)
    return !!slot && slot.quantity >= quantity
  },

  equipItem: (slot, itemId) => {
    set((state) => ({ equipment: { ...state.equipment, [slot]: itemId } }))
  },

  usePotion: (itemId) => {
    const { removeItem } = get()
    if (!removeItem(itemId, 1)) return
    // Effects applied via the item data in UI
    const effects: Record<string, () => void> = {
      healing_potion: () => get().heal(60),
      stamina_potion: () => get().regenStamina(50),
      swallow_potion: () => get().heal(8),
      tawny_owl: () => get().regenSignEnergy(60),
    }
    effects[itemId]?.()
    set({ notification: '使用了药水' })
  },

  startQuest: (questId) => {
    const { activeQuests, completedQuestIds } = get()
    if (activeQuests.find((q) => q.questId === questId) || completedQuestIds.includes(questId)) return
    const quest = QUESTS[questId]
    if (!quest) return
    const progress: QuestProgress = {
      questId,
      currentStage: 0,
      stageProgress: {},
      completed: false,
    }
    set((state) => ({
      activeQuests: [...state.activeQuests, progress],
      notification: `新任务：${quest.title}`,
    }))
  },

  advanceQuest: (questId, stageId, amount = 1) => {
    set((state) => {
      const quests = state.activeQuests.map((q) => {
        if (q.questId !== questId) return q
        const prev = q.stageProgress[stageId] ?? 0
        return { ...q, stageProgress: { ...q.stageProgress, [stageId]: prev + amount } }
      })
      return { activeQuests: quests }
    })
  },

  completeQuest: (questId) => {
    const quest = QUESTS[questId]
    if (!quest) return
    set((state) => ({
      activeQuests: state.activeQuests.filter((q) => q.questId !== questId),
      completedQuestIds: [...state.completedQuestIds, questId],
      notification: `任务完成：${quest.title}（+${quest.rewards.xp}经验，+${quest.rewards.gold}金币）`,
    }))
    get().gainXp(quest.rewards.xp)
    get().gainGold(quest.rewards.gold)
    quest.rewards.items?.forEach((itemId) => get().addItem(itemId, 1))
  },

  isQuestActive: (questId) => !!get().activeQuests.find((q) => q.questId === questId),
  isQuestCompleted: (questId) => get().completedQuestIds.includes(questId),

  getQuestStageProgress: (questId, stageId) => {
    const q = get().activeQuests.find((q) => q.questId === questId)
    return q?.stageProgress[stageId] ?? 0
  },

  unlockBestiaryEntry: (enemyId) => {
    set((state) => {
      if (state.bestiary[enemyId]?.unlocked) return state
      return {
        bestiary: { ...state.bestiary, [enemyId]: { ...state.bestiary[enemyId], unlocked: true } },
        notification: `图鉴解锁：${state.bestiary[enemyId]?.name}`,
      }
    })
  },

  openScreen: (screen) => set({ activeScreen: screen }),
  closeScreen: () => set({ activeScreen: 'none' }),

  openDialogue: (treeId) => {
    set({ activeDialogue: { treeId, currentNodeId: 'start' }, activeScreen: 'dialogue' })
  },
  setDialogueNode: (nodeId) => {
    set((state) => state.activeDialogue ? { activeDialogue: { ...state.activeDialogue, currentNodeId: nodeId } } : state)
  },
  closeDialogue: () => set({ activeDialogue: null, activeScreen: 'none' }),

  openShop: (npcId, items) => set({ shopState: { npcId, items }, activeScreen: 'shop' }),
  closeShop: () => set({ shopState: null, activeScreen: 'none' }),

  showNotification: (message) => set({ notification: message }),
  clearNotification: () => set({ notification: null }),

  setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),
  getFlag: (key) => get().flags[key],

  resetGame: () => set({
    phase: 'playing',
    currentZone: 'zone_village',
    dayTime: 0.5,
    dayCount: 1,
    player: { ...initialPlayer },
    inventory: JSON.parse(JSON.stringify(initialInventory)),
    equipment: { ...initialEquipment },
    activeQuests: [],
    completedQuestIds: [],
    bestiary: JSON.parse(JSON.stringify(BESTIARY)),
    activeScreen: 'none',
    activeDialogue: null,
    shopState: null,
    notification: null,
    flags: {},
  }),
}))

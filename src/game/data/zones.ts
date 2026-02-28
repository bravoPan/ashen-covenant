import type { ZoneDef } from './types'

// Tile types
export const TILES = {
  GRASS: 0,
  DIRT: 1,
  STONE: 2,
  WATER: 3,
  WALL: 4,
  TREE: 5,
  WOOD: 6,
  RUIN: 7,
  DARK_STONE: 8,
  PATH: 9,
} as const

const W = TILES.WALL
const G = TILES.GRASS
const D = TILES.DIRT
const S = TILES.STONE
const T = TILES.TREE
const P = TILES.PATH
const WA = TILES.WATER
const WO = TILES.WOOD
const R = TILES.RUIN
const DS = TILES.DARK_STONE

// Village map 40x30
const VILLAGE_TILES: number[][] = [
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,T,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T,T,G,G,G,G,G,G,T,T,G,W],
  [W,G,T,T,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,G,WO,WO,WO,G,G,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,T,T,G,W],
  [W,G,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,WO,G,WO,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,WO,G,WO,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,G,WO,WO,WO,G,G,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,G,G,G,WO,WO,WO,G,G,WO,WO,WO,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,T,G,G,G,G,G,G,G,G,P,G,G,G,WO,G,WO,G,G,WO,G,WO,G,G,G,P,G,G,G,G,G,G,G,G,G,T,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,G,G,G,WO,G,WO,G,G,WO,G,WO,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,G,G,G,WO,WO,WO,G,G,WO,WO,WO,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,P,P,P,P,P,D,D,D,D,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,T,T,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,T,T,G,G,G,G,W],
  [W,G,T,T,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,T,T,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,WO,WO,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,G,WO,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,G,WO,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,WO,WO,WO,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,WO,G,G,WO,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,WO,WO,WO,WO,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,G,G,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,D,D,D,D,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W],
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,G,G,G,G,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
]

// Forest map 50x35
function generateForestMap(): number[][] {
  const rows = 35, cols = 50
  const map: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        row.push(TILES.TREE)
      } else if (r > 12 && r < 16 && c > 1 && c < cols - 2) {
        row.push(TILES.PATH)
      } else if (c > 14 && c < 18 && r > 1 && r < rows - 2) {
        row.push(TILES.PATH)
      } else if ((r + c) % 7 === 0 || (r * 2 + c) % 11 === 0) {
        row.push(TILES.TREE)
      } else if ((r + c * 3) % 13 === 0) {
        row.push(TILES.WATER)
      } else {
        row.push(TILES.GRASS)
      }
    }
    map.push(row)
  }
  // Open entrance from village (top)
  for (let c = 16; c <= 20; c++) { map[0][c] = TILES.PATH; map[1][c] = TILES.PATH }
  // Open exit to ruins (right side)
  for (let r = 13; r <= 15; r++) { map[r][cols - 1] = TILES.PATH; map[r][cols - 2] = TILES.PATH }
  return map
}

// Ruins map 45x32
function generateRuinsMap(): number[][] {
  const rows = 32, cols = 45
  const map: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        row.push(TILES.DARK_STONE)
      } else if (r > 14 && r < 18 && c > 1 && c < cols - 2) {
        row.push(TILES.STONE)
      } else if (c > 20 && c < 25 && r > 1 && r < rows - 2) {
        row.push(TILES.STONE)
      } else if ((r + c) % 8 === 0) {
        row.push(TILES.RUIN)
      } else if ((r * 3 + c) % 15 === 0) {
        row.push(TILES.WALL)
      } else {
        row.push(TILES.DARK_STONE)
      }
    }
    map.push(row)
  }
  // Open entrance from forest (left side)
  for (let r = 14; r <= 17; r++) { map[r][0] = TILES.STONE; map[r][1] = TILES.STONE }
  return map
}

export const ZONES: Record<string, ZoneDef> = {
  zone_village: {
    id: 'zone_village',
    name: '幽影村',
    width: 40,
    height: 30,
    tileSize: 32,
    ambientColor: 0x8899AA,
    tiles: VILLAGE_TILES,
    npcSpawns: [
      { x: 18, y: 15, id: 'npc_chief' },
      { x: 21, y: 14, id: 'npc_merchant' },
      { x: 8, y: 23, id: 'npc_farmer' },
      { x: 28, y: 23, id: 'npc_innkeeper' },
      { x: 28, y: 5, id: 'npc_herbalist' },
      { x: 36, y: 5, id: 'npc_scholar' },
    ],
    enemySpawns: [],
    exits: [
      {
        x: 16, y: 29,
        width: 4, height: 1,
        targetZone: 'zone_forest',
        targetX: 18, targetY: 2,
        label: '→ 迷雾森林',
      },
    ],
    itemSpawns: [
      { x: 5, y: 5, itemId: 'moonflower', quantity: 2 },
      { x: 34, y: 8, itemId: 'red_berry', quantity: 2 },
    ],
  },

  zone_forest: {
    id: 'zone_forest',
    name: '迷雾森林',
    width: 50,
    height: 35,
    tileSize: 32,
    ambientColor: 0x4A6040,
    tiles: generateForestMap(),
    npcSpawns: [],
    enemySpawns: [
      { x: 10, y: 8, id: 'mountain_wolf', respawnTime: 60 },
      { x: 25, y: 20, id: 'mountain_wolf', respawnTime: 60 },
      { x: 38, y: 10, id: 'mountain_wolf', respawnTime: 60 },
      { x: 8, y: 25, id: 'drowner', respawnTime: 90 },
      { x: 42, y: 25, id: 'drowner', respawnTime: 90 },
      { x: 30, y: 8, id: 'drowner', respawnTime: 90 },
      { x: 20, y: 28, id: 'forest_witch', respawnTime: 120 },
      { x: 35, y: 28, id: 'forest_specter', respawnTime: 100 },
      { x: 42, y: 18, id: 'forest_specter', respawnTime: 100 },
    ],
    exits: [
      {
        x: 1, y: 0,
        width: 5, height: 1,
        targetZone: 'zone_village',
        targetX: 16, targetY: 27,
        label: '← 幽影村',
      },
      {
        x: 48, y: 13,
        width: 2, height: 3,
        targetZone: 'zone_ruins',
        targetX: 2, targetY: 15,
        label: '→ 腐朽废墟',
      },
    ],
    itemSpawns: [
      { x: 6, y: 6, itemId: 'moonflower', quantity: 1 },
      { x: 15, y: 20, itemId: 'moonflower', quantity: 2 },
      { x: 40, y: 5, itemId: 'red_berry', quantity: 2 },
      { x: 28, y: 30, itemId: 'swallow_feather', quantity: 1 },
      { x: 5, y: 30, itemId: 'missing_amulet', quantity: 1 },
      { x: 22, y: 27, itemId: 'cursed_stone', quantity: 1 },
    ],
  },

  zone_ruins: {
    id: 'zone_ruins',
    name: '腐朽废墟',
    width: 45,
    height: 32,
    tileSize: 32,
    ambientColor: 0x302830,
    tiles: generateRuinsMap(),
    npcSpawns: [],
    enemySpawns: [
      { x: 10, y: 8, id: 'skeleton_soldier', respawnTime: 90 },
      { x: 20, y: 10, id: 'skeleton_soldier', respawnTime: 90 },
      { x: 30, y: 8, id: 'skeleton_soldier', respawnTime: 90 },
      { x: 15, y: 20, id: 'skeleton_soldier', respawnTime: 90 },
      { x: 35, y: 20, id: 'skeleton_soldier', respawnTime: 90 },
      { x: 25, y: 25, id: 'forest_specter', respawnTime: 110 },
      { x: 40, y: 15, id: 'forest_specter', respawnTime: 110 },
    ],
    exits: [
      {
        x: 0, y: 14,
        width: 2, height: 4,
        targetZone: 'zone_forest',
        targetX: 46, targetY: 13,
        label: '← 迷雾森林',
      },
    ],
    itemSpawns: [
      { x: 8, y: 5, itemId: 'bone_fragment', quantity: 2 },
      { x: 35, y: 5, itemId: 'tawny_owl_feather', quantity: 1 },
      { x: 22, y: 28, itemId: 'magic_dust', quantity: 1 },
    ],
  },
}

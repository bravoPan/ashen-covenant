import Phaser from 'phaser'
import { TILES } from '../data/zones'

export class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene') }

  create() {
    this.generateTileTextures()
    this.generateEntityTextures()
    this.generateUITextures()
    this.scene.start('GameScene')
    this.scene.start('UIScene')
  }

  private generateTileTextures() {
    const size = 32
    const configs: Array<{ key: string; color: number; border?: number; pattern?: 'solid' | 'cross' | 'dot' | 'stripe' }> = [
      { key: `tile_${TILES.GRASS}`,      color: 0x3A5E2A, border: 0x2D4D20 },
      { key: `tile_${TILES.DIRT}`,       color: 0x7A5C38, border: 0x6B4F30 },
      { key: `tile_${TILES.STONE}`,      color: 0x6B6B6B, border: 0x555555 },
      { key: `tile_${TILES.WATER}`,      color: 0x1A4A7A, border: 0x1A3A6A, pattern: 'stripe' },
      { key: `tile_${TILES.WALL}`,       color: 0x222228, border: 0x111116 },
      { key: `tile_${TILES.TREE}`,       color: 0x1E3A14, border: 0x152A0D },
      { key: `tile_${TILES.WOOD}`,       color: 0x5C3D20, border: 0x4A3018 },
      { key: `tile_${TILES.RUIN}`,       color: 0x4A4040, border: 0x3A3030 },
      { key: `tile_${TILES.DARK_STONE}`, color: 0x2A2535, border: 0x1E1A28 },
      { key: `tile_${TILES.PATH}`,       color: 0x8C7A50, border: 0x7A6840 },
    ]

    configs.forEach(({ key, color, border, pattern }) => {
      const g = this.make.graphics({ x: 0, y: 0 })
      g.fillStyle(color)
      g.fillRect(0, 0, size, size)

      if (border) {
        g.fillStyle(border)
        g.fillRect(0, 0, size, 1)
        g.fillRect(0, size - 1, size, 1)
        g.fillRect(0, 0, 1, size)
        g.fillRect(size - 1, 0, 1, size)
      }

      if (pattern === 'stripe') {
        g.fillStyle(0xFFFFFF, 0.08)
        for (let i = 0; i < size; i += 6) g.fillRect(i, 0, 2, size)
      }

      if (pattern === 'dot') {
        g.fillStyle(0xFFFFFF, 0.1)
        for (let i = 4; i < size; i += 8) for (let j = 4; j < size; j += 8) g.fillCircle(i, j, 1)
      }

      g.generateTexture(key, size, size)
      g.destroy()
    })
  }

  private generateEntityTextures() {
    // Player
    this.createCharTexture('player', 0xE8C88C, 14, true)
    // Enemies
    this.createCharTexture('enemy_mountain_wolf',    0x8B6914, 14)
    this.createCharTexture('enemy_drowner',          0x1A6B6B, 16)
    this.createCharTexture('enemy_forest_witch',     0x6B1A6B, 15)
    this.createCharTexture('enemy_skeleton_soldier', 0xD0C8B0, 16)
    this.createCharTexture('enemy_forest_specter',   0xA0C8FF, 18)
    // NPCs
    this.createNpcTexture('npc_chief',     0xC8A870)
    this.createNpcTexture('npc_merchant',  0x70A8C8)
    this.createNpcTexture('npc_farmer',    0x90B870)
    this.createNpcTexture('npc_innkeeper', 0xC88870)
    this.createNpcTexture('npc_herbalist', 0x88C890)
    this.createNpcTexture('npc_scholar',   0x8870C8)
    // Items on ground
    this.createItemTexture()
    // Signs / effects
    this.createSignTextures()
    // Attack hit flash
    const hg = this.make.graphics({ x: 0, y: 0 })
    hg.fillStyle(0xFFFFFF, 0.6)
    hg.fillCircle(16, 16, 14)
    hg.generateTexture('hit_flash', 32, 32)
    hg.destroy()
  }

  private createCharTexture(key: string, color: number, radius: number, isPlayer = false) {
    const size = 40
    const g = this.make.graphics({ x: 0, y: 0 })
    // Shadow
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(size / 2, size - 4, radius * 1.8, 6)
    // Body
    g.fillStyle(color)
    g.fillCircle(size / 2, size / 2, radius)
    // Outline
    g.lineStyle(2, isPlayer ? 0xFFD700 : 0x000000, 0.7)
    g.strokeCircle(size / 2, size / 2, radius)
    // Direction indicator (forward dot)
    g.fillStyle(isPlayer ? 0xFFD700 : 0xFFFFFF, 0.9)
    g.fillCircle(size / 2, size / 2 - radius + 4, 3)
    g.generateTexture(key, size, size)
    g.destroy()
  }

  private createNpcTexture(key: string, color: number) {
    const size = 40
    const g = this.make.graphics({ x: 0, y: 0 })
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(size / 2, size - 4, 22, 6)
    g.fillStyle(color)
    g.fillCircle(size / 2, size / 2, 12)
    g.lineStyle(2, 0xFFFFFF, 0.5)
    g.strokeCircle(size / 2, size / 2, 12)
    // NPC indicator diamond on top
    g.fillStyle(0xFFD700)
    g.fillTriangle(size / 2, size / 2 - 20, size / 2 - 5, size / 2 - 14, size / 2 + 5, size / 2 - 14)
    g.generateTexture(key, size, size)
    g.destroy()
  }

  private createItemTexture() {
    const g = this.make.graphics({ x: 0, y: 0 })
    g.fillStyle(0xFFD700)
    g.fillTriangle(12, 0, 0, 20, 24, 20)
    g.lineStyle(1, 0xFFFFFF, 0.5)
    g.strokeTriangle(12, 0, 0, 20, 24, 20)
    g.generateTexture('item_pickup', 24, 24)
    g.destroy()
  }

  private createSignTextures() {
    // Fire (Igni)
    const fireG = this.make.graphics({ x: 0, y: 0 })
    fireG.fillStyle(0xFF6600, 0.8)
    fireG.fillCircle(20, 20, 18)
    fireG.fillStyle(0xFFAA00, 0.6)
    fireG.fillCircle(20, 20, 12)
    fireG.fillStyle(0xFFFFFF, 0.4)
    fireG.fillCircle(20, 20, 6)
    fireG.generateTexture('sign_fire', 40, 40)
    fireG.destroy()

    // Shock (Aard)
    const shockG = this.make.graphics({ x: 0, y: 0 })
    shockG.fillStyle(0x88CCFF, 0.8)
    shockG.fillCircle(20, 20, 18)
    shockG.fillStyle(0xFFFFFF, 0.9)
    shockG.fillCircle(20, 20, 8)
    shockG.generateTexture('sign_shock', 40, 40)
    shockG.destroy()

    // Shield (Quen)
    const shieldG = this.make.graphics({ x: 0, y: 0 })
    shieldG.fillStyle(0xFFDD44, 0.7)
    shieldG.fillCircle(20, 20, 18)
    shieldG.lineStyle(3, 0xFFFFFF, 0.9)
    shieldG.strokeCircle(20, 20, 16)
    shieldG.generateTexture('sign_shield', 40, 40)
    shieldG.destroy()
  }

  private generateUITextures() {
    // Health bar background
    const hbg = this.make.graphics({ x: 0, y: 0 })
    hbg.fillStyle(0x330000)
    hbg.fillRect(0, 0, 200, 16)
    hbg.generateTexture('bar_bg', 200, 16)
    hbg.destroy()
  }
}

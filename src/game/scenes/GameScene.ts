import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { ZONES, TILES } from '../data/zones'
import { ENEMIES } from '../data/enemies'
import { ITEMS } from '../data/items'
import { DIALOGUES } from '../data/dialogue'
import { QUESTS } from '../data/quests'
import type { ZoneDef } from '../data/types'

const TILE_SIZE = 32
const BLOCKING_TILES = new Set([TILES.WALL, TILES.TREE, TILES.WATER])

interface EntitySprite extends Phaser.GameObjects.Sprite {
  entityId?: string
  entityType?: 'enemy' | 'npc' | 'item'
  hp?: number
  maxHp?: number
  damage?: number
  speed?: number
  aiState?: 'idle' | 'patrol' | 'chase' | 'attack' | 'dead'
  aiTimer?: number
  patrolTargetX?: number
  patrolTargetY?: number
  hpBar?: Phaser.GameObjects.Graphics
  nameLabel?: Phaser.GameObjects.Text
  lootTable?: Array<{ itemId: string; chance: number; quantity: [number, number] }>
  xpValue?: number
  attackCooldown?: number
  respawnTimer?: number
  respawnX?: number
  respawnY?: number
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite
  private playerBody!: Phaser.Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key }
  private attackKey!: Phaser.Input.Keyboard.Key
  private dodgeKey!: Phaser.Input.Keyboard.Key
  private sign1Key!: Phaser.Input.Keyboard.Key
  private sign2Key!: Phaser.Input.Keyboard.Key
  private sign3Key!: Phaser.Input.Keyboard.Key
  private interactKey!: Phaser.Input.Keyboard.Key

  private mapLayer!: Phaser.GameObjects.Group
  private colliders: Phaser.Geom.Rectangle[] = []
  private exits: Array<{ rect: Phaser.Geom.Rectangle; def: ZoneDef['exits'][0] }> = []
  private entities!: Phaser.GameObjects.Group
  private itemPickups!: Phaser.GameObjects.Group

  private currentZoneDef!: ZoneDef
  private playerX = 0
  private playerY = 0

  private attackCooldown = 0
  private dodgeCooldown = 0
  private isDodging = false
  private dodgeTimer = 0
  private dodgeDirX = 0
  private dodgeDirY = 0
  private invincibleTimer = 0

  private activeSign: string | null = null
  private signTimer = 0

  private staminaRegenTimer = 0
  private signEnergyRegenTimer = 0

  private overlayGraphics!: Phaser.GameObjects.Graphics
  private dayOverlay!: Phaser.GameObjects.Rectangle

  private nearbyNpc: EntitySprite | null = null
  private nearbyItem: EntitySprite | null = null
  private interactPrompt!: Phaser.GameObjects.Text
  private zoneTransitionTimer = 0

  constructor() { super('GameScene') }

  create() {
    const store = useGameStore.getState()

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.attackKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    this.dodgeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    this.sign1Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    this.sign2Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    this.sign3Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F)

    this.mapLayer = this.add.group()
    this.entities = this.add.group()
    this.itemPickups = this.add.group()

    this.overlayGraphics = this.add.graphics()
    this.overlayGraphics.setDepth(50)

    this.dayOverlay = this.add.rectangle(0, 0, this.scale.width * 4, this.scale.height * 4, 0x000033, 0)
    this.dayOverlay.setDepth(49)

    this.interactPrompt = this.add.text(0, 0, '', {
      fontSize: '14px',
      color: '#FFD700',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 },
      fontFamily: 'sans-serif',
    }).setDepth(60).setVisible(false)

    this.loadZone(store.currentZone, 20 * TILE_SIZE, 15 * TILE_SIZE)

    // Listen for store changes
    useGameStore.subscribe((state, prev) => {
      if (state.currentZone !== prev.currentZone) {
        // Zone already loaded by transition logic
      }
    })

    // Keyboard shortcuts for UI
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I).on('down', () => {
      const s = useGameStore.getState()
      if (s.activeScreen === 'inventory') s.closeScreen()
      else s.openScreen('inventory')
    })
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L).on('down', () => {
      const s = useGameStore.getState()
      if (s.activeScreen === 'questlog') s.closeScreen()
      else s.openScreen('questlog')
    })
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B).on('down', () => {
      const s = useGameStore.getState()
      if (s.activeScreen === 'bestiary') s.closeScreen()
      else s.openScreen('bestiary')
    })
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.G).on('down', () => {
      const s = useGameStore.getState()
      if (s.activeScreen === 'alchemy') s.closeScreen()
      else s.openScreen('alchemy')
    })
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      const s = useGameStore.getState()
      if (s.activeScreen !== 'none') s.closeScreen()
      if (s.activeDialogue) s.closeDialogue()
    })
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H).on('down', () => {
      useGameStore.getState().usePotion('healing_potion')
    })
  }

  private loadZone(zoneId: string, startX: number, startY: number) {
    // Clear previous
    this.mapLayer.clear(true, true)
    this.entities.clear(true, true)
    this.itemPickups.clear(true, true)
    this.colliders = []
    this.exits = []

    const def = ZONES[zoneId]
    if (!def) return
    this.currentZoneDef = def

    useGameStore.getState().setZone(zoneId)

    // Render tiles
    for (let row = 0; row < def.height; row++) {
      for (let col = 0; col < def.width; col++) {
        const tileType = def.tiles[row]?.[col] ?? TILES.GRASS
        const px = col * TILE_SIZE
        const py = row * TILE_SIZE
        const tile = this.add.image(px + TILE_SIZE / 2, py + TILE_SIZE / 2, `tile_${tileType}`)
        tile.setDepth(0)
        this.mapLayer.add(tile)

        if (BLOCKING_TILES.has(tileType as 3 | 4 | 5)) {
          this.colliders.push(new Phaser.Geom.Rectangle(px, py, TILE_SIZE, TILE_SIZE))
        }
      }
    }

    // Zone exits
    def.exits.forEach((exit) => {
      const rect = new Phaser.Geom.Rectangle(
        exit.x * TILE_SIZE, exit.y * TILE_SIZE,
        exit.width * TILE_SIZE, exit.height * TILE_SIZE
      )
      this.exits.push({ rect, def: exit })

      const label = this.add.text(
        exit.x * TILE_SIZE + (exit.width * TILE_SIZE) / 2,
        exit.y * TILE_SIZE - 16,
        exit.label,
        { fontSize: '11px', color: '#AADDFF', fontFamily: 'sans-serif', backgroundColor: '#00000066', padding: { x: 4, y: 2 } }
      ).setOrigin(0.5, 1).setDepth(5)
      this.mapLayer.add(label as unknown as Phaser.GameObjects.GameObject)
    })

    // Spawn NPCs
    def.npcSpawns.forEach((spawn) => {
      this.spawnNpc(spawn.id, spawn.x * TILE_SIZE + TILE_SIZE / 2, spawn.y * TILE_SIZE + TILE_SIZE / 2)
    })

    // Spawn enemies
    def.enemySpawns.forEach((spawn) => {
      this.spawnEnemy(spawn.id, spawn.x * TILE_SIZE + TILE_SIZE / 2, spawn.y * TILE_SIZE + TILE_SIZE / 2, spawn.respawnTime ?? 60)
    })

    // Spawn item pickups
    def.itemSpawns.forEach((spawn) => {
      this.spawnItem(spawn.itemId, spawn.x * TILE_SIZE + TILE_SIZE / 2, spawn.y * TILE_SIZE + TILE_SIZE / 2, spawn.quantity)
    })

    // Player
    if (!this.player) {
      this.physics.add.existing(this.add.sprite(startX, startY, 'player').setDepth(10))
      this.player = this.children.list.find((c) => c instanceof Phaser.GameObjects.Sprite && (c as Phaser.GameObjects.Sprite).texture.key === 'player') as Phaser.GameObjects.Sprite
      this.physics.add.existing(this.player)
      this.playerBody = this.player.body as Phaser.Physics.Arcade.Body
      this.playerBody.setCollideWorldBounds(false)
      this.playerBody.setCircle(12, 8, 8)
      this.player.setDepth(10)
    } else {
      this.player.setPosition(startX, startY)
    }

    this.playerX = startX
    this.playerY = startY

    // Camera
    const worldW = def.width * TILE_SIZE
    const worldH = def.height * TILE_SIZE
    this.cameras.main.setBounds(0, 0, worldW, worldH)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1.2)

    // Day overlay reposition
    this.dayOverlay.setPosition(worldW / 2, worldH / 2)
    this.dayOverlay.setSize(worldW + 100, worldH + 100)
  }

  private spawnNpc(npcId: string, x: number, y: number) {
    const textureKey = `npc_${npcId.split('npc_')[1]}`
    const npc = this.add.sprite(x, y, textureKey) as EntitySprite
    npc.setDepth(8)
    npc.entityId = npcId
    npc.entityType = 'npc'
    this.physics.add.existing(npc, true) // static
    this.entities.add(npc)

    // Name label
    const npcNames: Record<string, string> = {
      npc_chief: '村长 陈德',
      npc_merchant: '商人 赵强',
      npc_farmer: '农场主 李昂',
      npc_innkeeper: '旅馆老板 苏梦',
      npc_herbalist: '草药师 王芸',
      npc_scholar: '学者 陈远',
    }
    const label = this.add.text(x, y - 26, npcNames[npcId] ?? npcId, {
      fontSize: '11px', color: '#FFFFAA', fontFamily: 'sans-serif',
      backgroundColor: '#00000066', padding: { x: 3, y: 1 },
    }).setOrigin(0.5, 1).setDepth(15)
    npc.nameLabel = label
  }

  private spawnEnemy(enemyId: string, x: number, y: number, respawnTime = 60) {
    const data = ENEMIES[enemyId]
    if (!data) return
    const enemy = this.add.sprite(x, y, `enemy_${enemyId}`) as EntitySprite
    enemy.setDepth(9)
    enemy.entityId = enemyId
    enemy.entityType = 'enemy'
    enemy.hp = data.hp
    enemy.maxHp = data.hp
    enemy.damage = data.damage
    enemy.speed = data.speed
    enemy.aiState = 'patrol'
    enemy.aiTimer = 0
    enemy.lootTable = data.loot
    enemy.xpValue = data.xp
    enemy.attackCooldown = 0
    enemy.respawnTimer = 0
    enemy.respawnX = x
    enemy.respawnY = y
    this.physics.add.existing(enemy)
    const body = enemy.body as Phaser.Physics.Arcade.Body
    body.setCircle(data.size * 0.7, 20 - data.size * 0.7, 20 - data.size * 0.7)
    this.entities.add(enemy)

    // HP bar
    const hpBar = this.add.graphics()
    hpBar.setDepth(16)
    enemy.hpBar = hpBar
    this.updateEnemyHpBar(enemy)

    // Name label
    const label = this.add.text(x, y - 28, data.name, {
      fontSize: '10px', color: '#FF6666', fontFamily: 'sans-serif',
      backgroundColor: '#00000088', padding: { x: 3, y: 1 },
    }).setOrigin(0.5, 1).setDepth(17)
    enemy.nameLabel = label
  }

  private spawnItem(itemId: string, x: number, y: number, quantity: number) {
    const sprite = this.add.sprite(x, y, 'item_pickup') as EntitySprite
    sprite.setDepth(3)
    sprite.entityId = itemId
    sprite.entityType = 'item'
    sprite.hp = quantity // reuse hp field for quantity
    this.itemPickups.add(sprite)

    const item = ITEMS[itemId]
    const label = this.add.text(x, y - 16, item?.name ?? itemId, {
      fontSize: '9px', color: '#FFD700', fontFamily: 'sans-serif',
    }).setOrigin(0.5, 1).setDepth(4)
    sprite.nameLabel = label

    this.tweens.add({ targets: sprite, y: y - 4, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
  }

  private updateEnemyHpBar(enemy: EntitySprite) {
    if (!enemy.hpBar) return
    const g = enemy.hpBar
    g.clear()
    const bw = 36, bh = 4
    const x = enemy.x - bw / 2
    const y = enemy.y - 30
    const ratio = Math.max(0, (enemy.hp ?? 0) / (enemy.maxHp ?? 1))
    g.fillStyle(0x550000)
    g.fillRect(x, y, bw, bh)
    g.fillStyle(ratio > 0.5 ? 0x22CC44 : ratio > 0.25 ? 0xEEAA00 : 0xCC2222)
    g.fillRect(x, y, bw * ratio, bh)
  }

  update(time: number, delta: number) {
    const store = useGameStore.getState()
    if (store.phase !== 'playing') return
    if (store.activeScreen !== 'none') return

    const dt = delta / 1000

    this.handlePlayerMovement(dt)
    this.handleAttack(time)
    this.handleSigns(time)
    this.handleDodge(dt)
    this.handleInteract()
    this.handleExits()
    this.updateEnemyAI(dt)
    this.updateTimers(dt)
    this.updateDayNight(dt)
    this.handleItemPickup()
    this.updateQuestObjectives()
  }

  private handlePlayerMovement(dt: number) {
    const store = useGameStore.getState()
    const speed = store.player.speed * (this.isDodging ? 2.5 : 1)
    let vx = 0, vy = 0

    if (this.isDodging) {
      vx = this.dodgeDirX * speed
      vy = this.dodgeDirY * speed
    } else {
      const left = this.cursors.left.isDown || this.wasd.left.isDown
      const right = this.cursors.right.isDown || this.wasd.right.isDown
      const up = this.cursors.up.isDown || this.wasd.up.isDown
      const down = this.cursors.down.isDown || this.wasd.down.isDown

      if (left) vx -= speed
      if (right) vx += speed
      if (up) vy -= speed
      if (down) vy += speed

      if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707 }

      if (vx !== 0 || vy !== 0) {
        const len = Math.sqrt(vx * vx + vy * vy)
        this.dodgeDirX = vx / len
        this.dodgeDirY = vy / len
      }
    }

    // Tile collision
    const newX = this.player.x + vx * dt
    const newY = this.player.y + vy * dt
    const r = 10

    if (!this.isSolid(newX - r, this.player.y) && !this.isSolid(newX + r, this.player.y)) {
      this.player.x = newX
    }
    if (!this.isSolid(this.player.x, newY - r) && !this.isSolid(this.player.x, newY + r)) {
      this.player.y = newY
    }

    // Clamp to zone
    const maxX = this.currentZoneDef.width * TILE_SIZE - 16
    const maxY = this.currentZoneDef.height * TILE_SIZE - 16
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, maxX)
    this.player.y = Phaser.Math.Clamp(this.player.y, 16, maxY)
  }

  private isSolid(x: number, y: number): boolean {
    const col = Math.floor(x / TILE_SIZE)
    const row = Math.floor(y / TILE_SIZE)
    const tileType = this.currentZoneDef.tiles[row]?.[col]
    if (tileType === undefined) return true
    return BLOCKING_TILES.has(tileType as 3 | 4 | 5)
  }

  private handleAttack(time: number) {
    if (this.attackCooldown > time) return
    if (!Phaser.Input.Keyboard.JustDown(this.attackKey)) return

    this.attackCooldown = time + 600

    const store = useGameStore.getState()
    if (!store.spendStamina(15)) {
      store.showNotification('耐力不足！')
      return
    }

    const attackRange = 60
    const baseDamage = store.player.attack

    // Find nearest enemy in range
    let hit = false
    this.entities.getChildren().forEach((child) => {
      const enemy = child as EntitySprite
      if (enemy.entityType !== 'enemy' || enemy.aiState === 'dead') return
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y)
      if (dist > attackRange) return

      hit = true
      const isSilver = store.equipment.weapon === 'silver_sword'
      let dmg = baseDamage + Phaser.Math.Between(-3, 3)

      // Oil bonus
      if (store.equipment.oil === 'beast_oil' && ['mountain_wolf'].includes(enemy.entityId ?? '')) dmg = Math.floor(dmg * 1.3)
      if (store.equipment.oil === 'specter_oil' && ['forest_specter'].includes(enemy.entityId ?? '')) dmg = Math.floor(dmg * 1.4)
      if (isSilver && ['drowner', 'forest_witch', 'forest_specter'].includes(enemy.entityId ?? '')) dmg = Math.floor(dmg * 1.5)
      if (!isSilver && ['forest_specter'].includes(enemy.entityId ?? '')) dmg = Math.floor(dmg * 0.5)

      this.applyDamageToEnemy(enemy, dmg)
    })

    // Attack flash
    const flash = this.add.sprite(this.player.x + this.dodgeDirX * 30, this.player.y + this.dodgeDirY * 30, 'hit_flash')
    flash.setDepth(20)
    flash.setAlpha(0.8)
    this.tweens.add({ targets: flash, alpha: 0, scaleX: 2, scaleY: 2, duration: 200, onComplete: () => flash.destroy() })

    if (!hit) {
      // Swing effect
    }
  }

  private applyDamageToEnemy(enemy: EntitySprite, damage: number) {
    if (!enemy.hp || enemy.aiState === 'dead') return
    enemy.hp = Math.max(0, enemy.hp - damage)

    // Damage text
    const txt = this.add.text(enemy.x + Phaser.Math.Between(-10, 10), enemy.y - 20, `-${damage}`, {
      fontSize: '13px', color: '#FF4444', fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setDepth(25)
    this.tweens.add({ targets: txt, y: txt.y - 30, alpha: 0, duration: 800, onComplete: () => txt.destroy() })

    this.updateEnemyHpBar(enemy)

    if (enemy.hp <= 0) this.killEnemy(enemy)
    else {
      // Knockback
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y)
      const body = enemy.body as Phaser.Physics.Arcade.Body
      body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200)
      this.time.delayedCall(300, () => { if (body) body.setVelocity(0, 0) })
      enemy.aiState = 'chase'
    }
  }

  private killEnemy(enemy: EntitySprite) {
    enemy.aiState = 'dead'
    enemy.setAlpha(0.4)
    enemy.hpBar?.clear()
    enemy.nameLabel?.setVisible(false)

    const store = useGameStore.getState()

    // XP
    store.gainXp(enemy.xpValue ?? 25)

    // Unlock bestiary
    if (enemy.entityId) store.unlockBestiaryEntry(enemy.entityId)

    // Advance kill objectives
    store.activeQuests.forEach((quest) => {
      const qDef = QUESTS[quest.questId]
      if (!qDef) return
      const stage = qDef.stages[quest.currentStage]
      if (!stage) return
      if (stage.objective.type === 'kill' && stage.objective.target === enemy.entityId) {
        store.advanceQuest(quest.questId, stage.id, 1)
        const progress = store.getQuestStageProgress(quest.questId, stage.id)
        if (progress >= stage.objective.count) {
          useGameStore.setState((s) => ({
            activeQuests: s.activeQuests.map((q) => q.questId === quest.questId ? { ...q, currentStage: q.currentStage + 1 } : q)
          }))
          store.showNotification(`任务目标完成：${qDef.title}`)
        }
      }
    })

    // Loot drop
    enemy.lootTable?.forEach((loot) => {
      if (Math.random() < loot.chance) {
        const qty = Phaser.Math.Between(loot.quantity[0], loot.quantity[1])
        this.spawnItem(loot.itemId, enemy.x + Phaser.Math.Between(-20, 20), enemy.y + Phaser.Math.Between(-20, 20), qty)
      }
    })

    // Death effect
    const deathEffect = this.add.graphics()
    deathEffect.setDepth(15)
    deathEffect.fillStyle(0xFF2200, 0.6)
    deathEffect.fillCircle(enemy.x, enemy.y, 20)
    this.tweens.add({ targets: deathEffect, alpha: 0, scaleX: 3, scaleY: 3, duration: 500, onComplete: () => deathEffect.destroy() })

    // Respawn after delay
    const respawnX = enemy.respawnX ?? enemy.x
    const respawnY = enemy.respawnY ?? enemy.y
    const enemyId = enemy.entityId ?? ''
    this.entities.remove(enemy, false, false)
    enemy.destroy()

    this.time.delayedCall((enemy.respawnTimer ?? 60) * 1000, () => {
      if (this.scene.isActive('GameScene')) {
        this.spawnEnemy(enemyId, respawnX, respawnY)
      }
    })
  }

  private handleSigns(time: number) {
    const store = useGameStore.getState()

    if (Phaser.Input.Keyboard.JustDown(this.sign1Key)) this.castSign('fire', time)
    if (Phaser.Input.Keyboard.JustDown(this.sign2Key)) this.castSign('shield', time)
    if (Phaser.Input.Keyboard.JustDown(this.sign3Key)) this.castSign('shock', time)
  }

  private castSign(type: 'fire' | 'shield' | 'shock', _time: number) {
    const store = useGameStore.getState()
    const costs: Record<string, number> = { fire: 20, shield: 15, shock: 18 }
    if (!store.spendSignEnergy(costs[type])) {
      store.showNotification('印记能量不足！')
      return
    }

    if (type === 'shield') {
      this.invincibleTimer = 4
      store.showNotification('护盾印激活！（4秒无敌）')
      const shieldEffect = this.add.sprite(this.player.x, this.player.y, 'sign_shield')
      shieldEffect.setDepth(12).setAlpha(0.8)
      this.tweens.add({ targets: shieldEffect, alpha: 0, scaleX: 2, scaleY: 2, duration: 1000, onComplete: () => shieldEffect.destroy() })
      return
    }

    if (type === 'shock') {
      // Aard: pushback all nearby enemies
      const range = 150
      let hit = false
      this.entities.getChildren().forEach((child) => {
        const enemy = child as EntitySprite
        if (enemy.entityType !== 'enemy' || enemy.aiState === 'dead') return
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y)
        if (dist > range) return
        hit = true
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y)
        const body = enemy.body as Phaser.Physics.Arcade.Body
        body.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)
        this.time.delayedCall(500, () => { if (body) body.setVelocity(0, 0) })
        this.applyDamageToEnemy(enemy, 25)
      })
      const effect = this.add.sprite(this.player.x, this.player.y, 'sign_shock')
      effect.setDepth(20)
      this.tweens.add({ targets: effect, alpha: 0, scaleX: 4, scaleY: 4, duration: 600, onComplete: () => effect.destroy() })
      if (!hit) store.showNotification('冲击印：范围内无目标')
      return
    }

    if (type === 'fire') {
      // Igni: fire projectile
      const dirX = this.dodgeDirX || 1
      const dirY = this.dodgeDirY || 0
      const fire = this.add.sprite(this.player.x, this.player.y, 'sign_fire')
      fire.setDepth(20)
      const speed = 350
      let travelX = 0, travelY = 0
      const maxDist = 200
      const interval = this.time.addEvent({
        delay: 16,
        repeat: Math.floor(maxDist / (speed * 0.016)),
        callback: () => {
          travelX += dirX * speed * 0.016
          travelY += dirY * speed * 0.016
          fire.setPosition(this.player.x + travelX, this.player.y + travelY)
          // Check hit
          this.entities.getChildren().forEach((child) => {
            const enemy = child as EntitySprite
            if (enemy.entityType !== 'enemy' || enemy.aiState === 'dead') return
            const dist = Phaser.Math.Distance.Between(fire.x, fire.y, enemy.x, enemy.y)
            if (dist < 25) {
              this.applyDamageToEnemy(enemy, 35)
              fire.destroy()
              interval.remove()
            }
          })
          if (!fire.active || !fire.scene) interval.remove()
        },
        callbackScope: this,
      })
      this.tweens.add({ targets: fire, alpha: 0, duration: 600, onComplete: () => { if (fire.active) fire.destroy() } })
    }
  }

  private handleDodge(dt: number) {
    if (this.dodgeCooldown > 0) { this.dodgeCooldown -= dt; return }
    if (!Phaser.Input.Keyboard.JustDown(this.dodgeKey)) return

    const store = useGameStore.getState()
    if (!store.spendStamina(20)) { store.showNotification('耐力不足！'); return }

    this.isDodging = true
    this.dodgeTimer = 0.25
    this.dodgeCooldown = 1.0
    this.invincibleTimer = Math.max(this.invincibleTimer, 0.25)
    this.player.setAlpha(0.6)
  }

  private handleInteract() {
    const interactRange = 50
    this.nearbyNpc = null
    this.nearbyItem = null

    this.entities.getChildren().forEach((child) => {
      const e = child as EntitySprite
      if (e.entityType !== 'npc') return
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
      if (dist < interactRange) this.nearbyNpc = e
    })

    this.itemPickups.getChildren().forEach((child) => {
      const e = child as EntitySprite
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
      if (dist < 40) this.nearbyItem = e
    })

    if (this.nearbyNpc || this.nearbyItem) {
      const target = this.nearbyNpc ?? this.nearbyItem!
      this.interactPrompt.setPosition(target.x, target.y - 45)
      this.interactPrompt.setText('[F] 互动')
      this.interactPrompt.setVisible(true)
    } else {
      this.interactPrompt.setVisible(false)
    }

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      if (this.nearbyItem) {
        const item = this.nearbyItem as EntitySprite
        const itemId = item.entityId ?? ''
        const qty = item.hp ?? 1
        const store = useGameStore.getState()
        store.addItem(itemId, qty)
        const itemName = ITEMS[itemId]?.name ?? itemId
        store.showNotification(`拾取：${itemName} x${qty}`)

        // Advance collect objectives
        store.activeQuests.forEach((quest) => {
          const qDef = QUESTS[quest.questId]
          if (!qDef) return
          const stage = qDef.stages[quest.currentStage]
          if (!stage) return
          if (stage.objective.type === 'collect' && stage.objective.target === itemId) {
            store.advanceQuest(quest.questId, stage.id, qty)
            const progress = store.getQuestStageProgress(quest.questId, stage.id)
            if (progress >= stage.objective.count) {
              useGameStore.setState((s) => ({
                activeQuests: s.activeQuests.map((q) => q.questId === quest.questId ? { ...q, currentStage: q.currentStage + 1 } : q)
              }))
              store.showNotification(`任务目标完成：${qDef.title}`)
            }
          }
        })

        item.nameLabel?.destroy()
        item.destroy()
        this.nearbyItem = null
      } else if (this.nearbyNpc) {
        const npc = this.nearbyNpc as EntitySprite
        const npcId = npc.entityId ?? ''
        const tree = DIALOGUES[npcId]
        if (tree) {
          // Check if quest complete dialogue
          const store = useGameStore.getState()
          const hasQuestDone = this.checkQuestCompleteDialogue(npcId)
          if (!hasQuestDone) {
            store.openDialogue(npcId)
          }
        }
      }
    }
  }

  private checkQuestCompleteDialogue(npcId: string): boolean {
    const store = useGameStore.getState()
    // Check deliver objectives
    let handled = false
    store.activeQuests.forEach((quest) => {
      const qDef = QUESTS[quest.questId]
      if (!qDef) return
      const stage = qDef.stages[quest.currentStage]
      if (!stage) return
      if (stage.objective.type === 'talk' && stage.objective.target === npcId) {
        store.advanceQuest(quest.questId, stage.id, 1)
        const nextStage = quest.currentStage + 1
        if (nextStage >= qDef.stages.length) {
          store.completeQuest(quest.questId)
        } else {
          useGameStore.setState((s) => ({
            activeQuests: s.activeQuests.map((q) => q.questId === quest.questId ? { ...q, currentStage: nextStage } : q)
          }))
          store.showNotification(`任务进展：${qDef.title}`)
        }
        handled = true
      }
      if (stage.objective.type === 'deliver' && stage.objective.target === npcId) {
        const deliverItem = this.getDeliverItem(quest.questId)
        if (deliverItem && store.hasItem(deliverItem)) {
          store.removeItem(deliverItem, 1)
          const nextStage = quest.currentStage + 1
          if (nextStage >= qDef.stages.length) store.completeQuest(quest.questId)
          else {
            useGameStore.setState((s) => ({
              activeQuests: s.activeQuests.map((q) => q.questId === quest.questId ? { ...q, currentStage: nextStage } : q)
            }))
          }
          handled = true
        }
      }
    })
    if (!handled) store.openDialogue(npcId)
    return handled
  }

  private getDeliverItem(questId: string): string | null {
    const map: Record<string, string> = {
      contract_02: 'missing_amulet',
      contract_04: 'moonflower',
    }
    return map[questId] ?? null
  }

  private handleExits() {
    if (this.zoneTransitionTimer > 0) { this.zoneTransitionTimer -= 1; return }
    this.exits.forEach(({ rect, def: exitDef }) => {
      if (rect.contains(this.player.x, this.player.y)) {
        this.zoneTransitionTimer = 60
        this.cameras.main.fadeOut(400, 0, 0, 0)
        this.time.delayedCall(400, () => {
          this.loadZone(exitDef.targetZone, exitDef.targetX * TILE_SIZE, exitDef.targetY * TILE_SIZE)
          this.cameras.main.fadeIn(400)
          useGameStore.getState().showNotification(`进入 ${ZONES[exitDef.targetZone]?.name ?? exitDef.targetZone}`)
        })
      }
    })
  }

  private updateEnemyAI(dt: number) {
    const chaseRange = 200
    const attackRange = 40
    const store = useGameStore.getState()

    this.entities.getChildren().forEach((child) => {
      const enemy = child as EntitySprite
      if (enemy.entityType !== 'enemy' || enemy.aiState === 'dead') return

      const body = enemy.body as Phaser.Physics.Arcade.Body
      const distToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y)

      enemy.aiTimer = (enemy.aiTimer ?? 0) - dt

      if (enemy.attackCooldown) enemy.attackCooldown -= dt

      if (distToPlayer <= chaseRange) {
        enemy.aiState = 'chase'
      } else if (enemy.aiState === 'chase') {
        enemy.aiState = 'patrol'
      }

      if (enemy.aiState === 'patrol') {
        if (enemy.aiTimer <= 0) {
          enemy.aiTimer = 2 + Math.random() * 3
          enemy.patrolTargetX = (enemy.respawnX ?? enemy.x) + Phaser.Math.Between(-80, 80)
          enemy.patrolTargetY = (enemy.respawnY ?? enemy.y) + Phaser.Math.Between(-80, 80)
        }
        if (enemy.patrolTargetX !== undefined) {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, enemy.patrolTargetX!, enemy.patrolTargetY!)
          const spd = (enemy.speed ?? 80) * 0.4
          body.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd)
        }
      } else if (enemy.aiState === 'chase') {
        if (distToPlayer <= attackRange) {
          body.setVelocity(0, 0)
          if ((enemy.attackCooldown ?? 0) <= 0) {
            enemy.attackCooldown = 1.5
            if (this.invincibleTimer <= 0) {
              store.takeDamage(enemy.damage ?? 10)
              // Damage flash
              this.cameras.main.shake(150, 0.008)
            }
          }
        } else {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y)
          const spd = enemy.speed ?? 80
          body.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd)
        }
      }

      // Update nameLabel and hpBar positions
      if (enemy.nameLabel) {
        enemy.nameLabel.setPosition(enemy.x, enemy.y - 28)
      }
      this.updateEnemyHpBar(enemy)
    })
  }

  private updateTimers(dt: number) {
    if (this.isDodging) {
      this.dodgeTimer -= dt
      if (this.dodgeTimer <= 0) {
        this.isDodging = false
        this.player.setAlpha(1)
      }
    }
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt
      if (this.invincibleTimer <= 0) this.player.setAlpha(1)
    }
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt

    // Regen
    this.staminaRegenTimer += dt
    if (this.staminaRegenTimer >= 0.1) {
      this.staminaRegenTimer = 0
      useGameStore.getState().regenStamina(2)
    }
    this.signEnergyRegenTimer += dt
    if (this.signEnergyRegenTimer >= 0.2) {
      this.signEnergyRegenTimer = 0
      useGameStore.getState().regenSignEnergy(1)
    }

    // Advance time
    useGameStore.getState().advanceTime(dt)
  }

  private updateDayNight(_dt: number) {
    const { dayTime } = useGameStore.getState()
    // 0.25-0.75 = day, 0-0.25 and 0.75-1 = night
    let alpha = 0
    if (dayTime < 0.2) alpha = 0.55
    else if (dayTime < 0.3) alpha = Phaser.Math.Linear(0.55, 0, (dayTime - 0.2) / 0.1)
    else if (dayTime < 0.7) alpha = 0
    else if (dayTime < 0.8) alpha = Phaser.Math.Linear(0, 0.55, (dayTime - 0.7) / 0.1)
    else alpha = 0.55
    this.dayOverlay.setAlpha(alpha)
  }

  private handleItemPickup() {
    // Auto-pickup items very close
    this.itemPickups.getChildren().forEach((child) => {
      const item = child as EntitySprite
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y)
      if (dist < 20) {
        const itemId = item.entityId ?? ''
        const qty = item.hp ?? 1
        useGameStore.getState().addItem(itemId, qty)
        item.nameLabel?.destroy()
        item.destroy()
      }
    })
  }

  private updateQuestObjectives() {
    const store = useGameStore.getState()
    store.activeQuests.forEach((quest) => {
      const qDef = QUESTS[quest.questId]
      if (!qDef) return
      const stage = qDef.stages[quest.currentStage]
      if (!stage) return
      if (stage.objective.type === 'reach') {
        if (stage.objective.target === store.currentZone) {
          store.advanceQuest(quest.questId, stage.id, 1)
          const nextStage = quest.currentStage + 1
          if (nextStage >= qDef.stages.length) store.completeQuest(quest.questId)
          else {
            useGameStore.setState((s) => ({
              activeQuests: s.activeQuests.map((q) => q.questId === quest.questId ? { ...q, currentStage: nextStage } : q)
            }))
            store.showNotification(`任务进展：${qDef.title}`)
          }
        }
      }
    })
  }
}

import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'

export class UIScene extends Phaser.Scene {
  private hudBars!: Phaser.GameObjects.Graphics
  private hudText!: Phaser.GameObjects.Text
  private zoneText!: Phaser.GameObjects.Text
  private timeText!: Phaser.GameObjects.Text
  private controlsText!: Phaser.GameObjects.Text

  constructor() { super({ key: 'UIScene', active: false }) }

  create() {
    this.hudBars = this.add.graphics()
    this.hudText = this.add.text(14, 14, '', {
      fontSize: '12px', color: '#FFFFFF', fontFamily: 'sans-serif',
      backgroundColor: '#00000066', padding: { x: 4, y: 2 },
    }).setDepth(100).setScrollFactor(0)

    this.zoneText = this.add.text(this.scale.width / 2, 14, '', {
      fontSize: '16px', color: '#FFD700', fontFamily: 'sans-serif',
      fontStyle: 'bold', backgroundColor: '#00000088', padding: { x: 8, y: 4 },
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0)

    this.timeText = this.add.text(this.scale.width - 14, 14, '', {
      fontSize: '12px', color: '#AACCFF', fontFamily: 'sans-serif',
      backgroundColor: '#00000066', padding: { x: 4, y: 2 },
    }).setOrigin(1, 0).setDepth(100).setScrollFactor(0)

    this.controlsText = this.add.text(14, this.scale.height - 14, '移动:WASD/方向键  攻击:J  闪避:K  印记1-3  互动:F  背包:I  任务:L  图鉴:B  炼金:G  喝药:H', {
      fontSize: '10px', color: '#AAAAAA', fontFamily: 'sans-serif',
      backgroundColor: '#00000066', padding: { x: 4, y: 2 },
    }).setOrigin(0, 1).setDepth(100).setScrollFactor(0)
  }

  update() {
    const store = useGameStore.getState()
    if (store.phase === 'menu') return

    this.drawHUD(store)
  }

  private drawHUD(store: ReturnType<typeof useGameStore.getState>) {
    this.hudBars.clear()
    const { player } = store
    const x = 14, y = 48
    const w = 180

    // HP bar
    this.drawBar(x, y, w, 14, player.hp / player.maxHp, 0xCC2222, 0x550000, '生命')
    // Stamina bar
    this.drawBar(x, y + 20, w, 14, player.stamina / player.maxStamina, 0x22AA44, 0x0A3318, '耐力')
    // Sign energy bar
    this.drawBar(x, y + 40, w, 14, player.signEnergy / player.maxSignEnergy, 0x2244CC, 0x0A1855, '印记')

    this.hudText.setText([
      `${player.name}  Lv.${player.level}`,
      `HP ${player.hp}/${player.maxHp}`,
      `耐力 ${Math.floor(player.stamina)}/${player.maxStamina}`,
      `印记 ${Math.floor(player.signEnergy)}/${player.maxSignEnergy}`,
      `金币 ${player.gold}`,
      `经验 ${player.xp}/${player.xpToNext}`,
    ])

    const zone = store.currentZone === 'zone_village' ? '幽影村' : store.currentZone === 'zone_forest' ? '迷雾森林' : '腐朽废墟'
    this.zoneText.setText(zone)

    const hour = Math.floor(store.dayTime * 24)
    const isDay = store.dayTime > 0.25 && store.dayTime < 0.75
    this.timeText.setText(`第${store.dayCount}天  ${hour.toString().padStart(2, '0')}:00  ${isDay ? '☀ 白天' : '☽ 夜晚'}`)

    // Sign cooldown hints
  }

  private drawBar(x: number, y: number, w: number, h: number, ratio: number, fill: number, bg: number, label: string) {
    this.hudBars.fillStyle(bg)
    this.hudBars.fillRect(x, y, w, h)
    this.hudBars.fillStyle(fill)
    this.hudBars.fillRect(x, y, Math.floor(w * Math.max(0, ratio)), h)
    this.hudBars.lineStyle(1, 0x444444)
    this.hudBars.strokeRect(x, y, w, h)
  }
}

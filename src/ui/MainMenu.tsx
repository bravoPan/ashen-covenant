import { useGameStore } from '../store/gameStore'
import { panel, btn, btnGold } from './styles'

export function MainMenu() {
  const { resetGame, openScreen } = useGameStore()

  return (
    <div style={{
      ...panel,
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #000000 100%)',
      pointerEvents: 'auto',
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{
          fontSize: 52, fontWeight: 'bold', color: '#FFD700',
          textShadow: '0 0 30px #FFD70088, 0 0 60px #FFD70044',
          letterSpacing: 8, fontFamily: 'serif',
        }}>灰烬契约</div>
        <div style={{ color: '#8a7a9a', fontSize: 14, marginTop: 8, letterSpacing: 4 }}>
          Ashen Covenant — 黑暗奇幻 RPG
        </div>
      </div>

      {/* Decorative divider */}
      <div style={{ width: 300, height: 1, background: 'linear-gradient(90deg, transparent, #6a4a90, transparent)', marginBottom: 40 }} />

      {/* Menu buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
        <button style={{ ...btnGold, fontSize: 16, padding: '12px 0', textAlign: 'center' }} onClick={() => {
          resetGame()
        }}>
          开始新游戏
        </button>
        <button style={{ ...btn, fontSize: 14, padding: '10px 0', textAlign: 'center', opacity: 0.5, cursor: 'not-allowed' }}>
          继续游戏（暂未实现）
        </button>
      </div>

      {/* Lore */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        color: '#6a5a7a', fontSize: 12, textAlign: 'center', maxWidth: 500, lineHeight: 1.8,
      }}>
        "在这片土地上，没有英雄，只有幸存者。<br />
        诅咒蔓延，怪物横行，而你是唯一的猎者。"
      </div>
    </div>
  )
}

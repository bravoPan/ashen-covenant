import { useGameStore } from '../store/gameStore'
import { btn, btnGold } from './styles'

export function DeathScreen() {
  const { resetGame } = useGameStore()

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'auto', zIndex: 500,
    }}>
      <div style={{
        color: '#CC2222', fontSize: 48, fontWeight: 'bold',
        fontFamily: 'serif', letterSpacing: 6,
        textShadow: '0 0 30px #CC222288',
        marginBottom: 16,
      }}>
        你已倒下
      </div>
      <div style={{ color: '#6a5a7a', fontSize: 14, marginBottom: 40, fontStyle: 'italic' }}>
        "死亡不是终点，只是另一段旅程的开始。"
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button style={{ ...btnGold, padding: '12px 28px', fontSize: 15 }} onClick={() => resetGame()}>
          重新开始
        </button>
      </div>
    </div>
  )
}

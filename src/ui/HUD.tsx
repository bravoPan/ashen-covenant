import { useGameStore } from '../store/gameStore'
import { QUESTS } from '../game/data/quests'

function Bar({ value, max, color, bg }: { value: number; max: number; color: string; bg: string }) {
  const ratio = Math.max(0, Math.min(1, value / max))
  return (
    <div style={{ width: 160, height: 12, background: bg, borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
      <div style={{ width: `${ratio * 100}%`, height: '100%', background: color, transition: 'width 0.2s' }} />
    </div>
  )
}

export function HUD() {
  const { player, currentZone, dayTime, dayCount, activeQuests } = useGameStore()
  const zone = currentZone === 'zone_village' ? '幽影村' : currentZone === 'zone_forest' ? '迷雾森林' : '腐朽废墟'
  const hour = Math.floor(dayTime * 24)
  const isDay = dayTime > 0.25 && dayTime < 0.75

  return (
    <>
      {/* Top-left: player stats */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        background: '#00000088', border: '1px solid #4a3a60',
        borderRadius: 4, padding: '10px 14px',
        pointerEvents: 'none', minWidth: 190,
      }}>
        <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', marginBottom: 8, fontFamily: 'serif' }}>
          {player.name} <span style={{ color: '#aaa', fontSize: 11 }}>Lv.{player.level}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#cc4444', fontSize: 10, width: 24 }}>HP</span>
            <Bar value={player.hp} max={player.maxHp} color="#cc4444" bg="#330000" />
            <span style={{ color: '#999', fontSize: 10 }}>{player.hp}/{player.maxHp}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#44aa66', fontSize: 10, width: 24 }}>耐</span>
            <Bar value={player.stamina} max={player.maxStamina} color="#44aa66" bg="#0a3318" />
            <span style={{ color: '#999', fontSize: 10 }}>{Math.floor(player.stamina)}/{player.maxStamina}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4466cc', fontSize: 10, width: 24 }}>印</span>
            <Bar value={player.signEnergy} max={player.maxSignEnergy} color="#4466cc" bg="#0a1855" />
            <span style={{ color: '#999', fontSize: 10 }}>{Math.floor(player.signEnergy)}/{player.maxSignEnergy}</span>
          </div>
        </div>
        <div style={{ marginTop: 8, color: '#FFD700', fontSize: 11 }}>
          💰 {player.gold} 金币 &nbsp;·&nbsp; XP {player.xp}/{player.xpToNext}
        </div>
      </div>

      {/* Top-center: zone + time */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
        background: '#00000088', border: '1px solid #4a3a60',
        borderRadius: 4, padding: '6px 16px', pointerEvents: 'none', textAlign: 'center',
      }}>
        <div style={{ color: '#FFD700', fontSize: 15, fontFamily: 'serif', fontWeight: 'bold' }}>{zone}</div>
        <div style={{ color: '#aaccff', fontSize: 10, marginTop: 2 }}>
          第{dayCount}天 · {String(hour).padStart(2, '0')}:00 · {isDay ? '☀ 白天' : '☽ 夜晚'}
        </div>
      </div>

      {/* Top-right: sign hotkeys */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        background: '#00000088', border: '1px solid #4a3a60',
        borderRadius: 4, padding: '8px 12px', pointerEvents: 'none',
      }}>
        <div style={{ color: '#aaa', fontSize: 10, marginBottom: 4 }}>印记</div>
        {[
          { key: '1', name: '火焰印', color: '#FF6600' },
          { key: '2', name: '护盾印', color: '#FFDD44' },
          { key: '3', name: '冲击印', color: '#88CCFF' },
        ].map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ background: '#333', borderRadius: 2, padding: '1px 5px', fontSize: 10, color: '#fff' }}>{s.key}</span>
            <span style={{ color: s.color, fontSize: 11 }}>{s.name}</span>
          </div>
        ))}
      </div>

      {/* Active quests mini */}
      {activeQuests.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 50, right: 14,
          background: '#00000088', border: '1px solid #4a3a60',
          borderRadius: 4, padding: '8px 12px', pointerEvents: 'none', maxWidth: 220,
        }}>
          <div style={{ color: '#FFD700', fontSize: 11, marginBottom: 4 }}>当前任务</div>
          {activeQuests.slice(0, 3).map(q => {
              const qDef = QUESTS[q.questId]
            const stage = qDef?.stages[q.currentStage]
            return (
              <div key={q.questId} style={{ marginBottom: 4 }}>
                <div style={{ color: '#e0d0c0', fontSize: 11 }}>{qDef?.title}</div>
                {stage && <div style={{ color: '#888', fontSize: 10 }}>▸ {stage.description}</div>}
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom: controls hint */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        color: '#555', fontSize: 10, fontFamily: 'sans-serif', pointerEvents: 'none',
        background: '#00000066', padding: '3px 10px', borderRadius: 3,
        whiteSpace: 'nowrap',
      }}>
        移动:WASD · 攻击:J · 闪避:K · 印记:1/2/3 · 互动:F · 喝药:H · 背包:I · 任务:L · 图鉴:B · 炼金:G · Esc:关闭
      </div>
    </>
  )
}

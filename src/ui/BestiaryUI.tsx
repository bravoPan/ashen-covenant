import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { panelOverlay, title, closeBtn } from './styles'

export function BestiaryUI() {
  const { bestiary, closeScreen } = useGameStore()
  const [selected, setSelected] = useState<string | null>(null)
  const entries = Object.values(bestiary)
  const selectedEntry = selected ? bestiary[selected] : null

  return (
    <div style={{ ...panelOverlay, width: 700, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={title}>怪物图鉴 [B]</div>
        <button style={closeBtn} onClick={closeScreen}>关闭</button>
      </div>
      <div style={{ color: '#555', fontSize: 11, marginBottom: 12 }}>
        已解锁 {entries.filter(e => e.unlocked).length} / {entries.length}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
        {/* List */}
        <div>
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => entry.unlocked && setSelected(entry.id === selected ? null : entry.id)}
              style={{
                padding: '7px 10px', marginBottom: 4, borderRadius: 3,
                cursor: entry.unlocked ? 'pointer' : 'default',
                background: selected === entry.id ? '#2a1f4a' : '#1a1428',
                border: `1px solid ${selected === entry.id ? '#8a5aaa' : '#2a2038'}`,
                opacity: entry.unlocked ? 1 : 0.35,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#e0d0c0', fontSize: 13 }}>
                  {entry.unlocked ? entry.name : '???'}
                </span>
                <span style={{ color: '#6a5a8a', fontSize: 10 }}>{entry.category}</span>
              </div>
              {!entry.unlocked && (
                <div style={{ color: '#444', fontSize: 10 }}>击败该怪物后解锁</div>
              )}
            </div>
          ))}
        </div>
        {/* Detail */}
        {selectedEntry?.unlocked ? (
          <div style={{ background: '#0d0a18', borderRadius: 4, padding: 12, border: '1px solid #2a2038' }}>
            <div style={{ color: '#FFD700', fontSize: 16, marginBottom: 2 }}>{selectedEntry.name}</div>
            <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 10 }}>{selectedEntry.category}</div>
            <div style={{ color: '#b0a0c0', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{selectedEntry.description}</div>
            <div style={{ color: '#888', fontSize: 11, lineHeight: 1.7, marginBottom: 10, fontStyle: 'italic' }}>{selectedEntry.lore}</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: '#44aa66', fontSize: 11, marginBottom: 3 }}>弱点：</div>
              {selectedEntry.weaknesses.map(w => (
                <div key={w} style={{ color: '#e0d0c0', fontSize: 12, marginBottom: 2 }}>• {w}</div>
              ))}
            </div>
            {selectedEntry.resistances.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ color: '#cc4444', fontSize: 11, marginBottom: 3 }}>抗性：</div>
                {selectedEntry.resistances.map(r => (
                  <div key={r} style={{ color: '#e0d0c0', fontSize: 12, marginBottom: 2 }}>• {r}</div>
                ))}
              </div>
            )}
            <div style={{ background: '#1a1428', borderRadius: 3, padding: '8px 10px', marginTop: 8 }}>
              <div style={{ color: '#FFD700', fontSize: 11, marginBottom: 4 }}>猎人提示：</div>
              <div style={{ color: '#b0a0c0', fontSize: 12, lineHeight: 1.6 }}>{selectedEntry.tips}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#444', fontSize: 12, padding: 12 }}>
            {selected ? '该条目尚未解锁。' : '点击已解锁的条目查看详情。'}
          </div>
        )}
      </div>
    </div>
  )
}

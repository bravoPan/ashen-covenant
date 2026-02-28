import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { ITEMS } from '../game/data/items'
import { panel, panelOverlay, title, btn, closeBtn } from './styles'

export function Inventory() {
  const { inventory, equipment, equipItem, usePotion, closeScreen, player } = useGameStore()
  const [selected, setSelected] = useState<string | null>(null)

  const selectedItem = selected ? ITEMS[selected] : null
  const selectedSlot = inventory.find(s => s.itemId === selected)

  const typeLabel: Record<string, string> = {
    weapon: '武器', armor: '护甲', potion: '药水', ingredient: '材料',
    oil: '涂油', bomb: '炸弹', quest: '任务道具', misc: '杂项',
  }
  const typeGroups = ['weapon', 'armor', 'oil', 'bomb', 'potion', 'ingredient', 'misc', 'quest']

  return (
    <div style={{ ...panelOverlay, width: 700, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={title}>背包 [I]</div>
        <button style={closeBtn} onClick={closeScreen}>关闭</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: item list */}
        <div>
          {typeGroups.map(type => {
            const items = inventory.filter(s => ITEMS[s.itemId]?.type === type)
            if (!items.length) return null
            return (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 4 }}>{typeLabel[type] ?? type}</div>
                {items.map(slot => {
                  const item = ITEMS[slot.itemId]
                  const isEq = Object.values(equipment).includes(slot.itemId)
                  return (
                    <div
                      key={slot.itemId}
                      onClick={() => setSelected(slot.itemId === selected ? null : slot.itemId)}
                      style={{
                        padding: '5px 8px', marginBottom: 2, borderRadius: 3, cursor: 'pointer',
                        background: selected === slot.itemId ? '#2a1f4a' : '#1a1428',
                        border: `1px solid ${selected === slot.itemId ? '#8a5aaa' : '#2a2038'}`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#e0d0c0', fontSize: 13 }}>
                        {isEq && <span style={{ color: '#FFD700', marginRight: 4 }}>★</span>}
                        {item?.name ?? slot.itemId}
                      </span>
                      <span style={{ color: '#666', fontSize: 11 }}>x{slot.quantity}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {inventory.length === 0 && <div style={{ color: '#555', fontSize: 13 }}>背包是空的</div>}
        </div>

        {/* Right: item detail + actions */}
        <div>
          {/* Equipment slots */}
          <div style={{ marginBottom: 16, background: '#0d0a18', borderRadius: 4, padding: 10, border: '1px solid #2a2038' }}>
            <div style={{ color: '#FFD700', fontSize: 12, marginBottom: 8 }}>当前装备</div>
            {[
              { slot: 'weapon' as const, label: '武器' },
              { slot: 'armor' as const, label: '护甲' },
              { slot: 'oil' as const, label: '涂油' },
            ].map(({ slot, label }) => (
              <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#666' }}>{label}:</span>
                <span style={{ color: '#e0d0c0' }}>{equipment[slot] ? ITEMS[equipment[slot]!]?.name : '—'}</span>
              </div>
            ))}
            <div style={{ marginTop: 6, fontSize: 11, color: '#666' }}>
              攻击 {player.attack} · 防御 {player.defense}
            </div>
          </div>

          {/* Selected item details */}
          {selectedItem && selectedSlot ? (
            <div style={{ background: '#0d0a18', borderRadius: 4, padding: 10, border: '1px solid #2a2038' }}>
              <div style={{ color: '#FFD700', fontSize: 14, marginBottom: 6 }}>{selectedItem.name}</div>
              <div style={{ color: '#888', fontSize: 11, marginBottom: 8 }}>{typeLabel[selectedItem.type] ?? selectedItem.type}</div>
              <div style={{ color: '#b0a0c0', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{selectedItem.description}</div>
              {selectedItem.stats && (
                <div style={{ color: '#aaa', fontSize: 11, marginBottom: 8 }}>
                  {Object.entries(selectedItem.stats).map(([k, v]) => (
                    <span key={k} style={{ marginRight: 8 }}>+{v} {k === 'attack' ? '攻击' : k === 'defense' ? '防御' : k}</span>
                  ))}
                </div>
              )}
              <div style={{ color: '#888', fontSize: 11, marginBottom: 10 }}>
                价值: {selectedItem.value} 金币 · 数量: {selectedSlot.quantity}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedItem.type === 'weapon' && (
                  <button style={btn} onClick={() => equipItem('weapon', selected!)}>
                    {equipment.weapon === selected ? '已装备' : '装备武器'}
                  </button>
                )}
                {selectedItem.type === 'armor' && (
                  <button style={btn} onClick={() => equipItem('armor', selected!)}>
                    {equipment.armor === selected ? '已装备' : '装备护甲'}
                  </button>
                )}
                {selectedItem.type === 'oil' && (
                  <button style={btn} onClick={() => equipItem('oil', selected!)}>
                    {equipment.oil === selected ? '已装备' : '装备涂油'}
                  </button>
                )}
                {selectedItem.type === 'potion' && (
                  <button style={{ ...btn, borderColor: '#44aa66' }} onClick={() => { usePotion(selected!); setSelected(null) }}>
                    使用
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#444', fontSize: 12, padding: 10 }}>点击物品查看详情</div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { ITEMS } from '../game/data/items'
import { panelOverlay, title, closeBtn, btn, btnGold } from './styles'

export function ShopUI() {
  const { shopState, closeShop, player, spendGold, addItem, inventory, removeItem, gainGold } = useGameStore()
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  if (!shopState) return null

  const tabStyle = (active: boolean) => ({
    padding: '5px 14px', cursor: 'pointer', fontSize: 12,
    background: active ? '#2a1f4a' : '#1a1428',
    border: `1px solid ${active ? '#8a5aaa' : '#2a2038'}`,
    borderRadius: 3, color: active ? '#FFD700' : '#888',
  } as const)

  const sellableItems = inventory.filter(s => {
    const item = ITEMS[s.itemId]
    return item && item.type !== 'quest' && item.value > 0
  })

  return (
    <div style={{ ...panelOverlay, width: 600, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={title}>商店</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#FFD700', fontSize: 13 }}>💰 {player.gold}</span>
          <button style={closeBtn} onClick={closeShop}>关闭</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button style={tabStyle(tab === 'buy')} onClick={() => setTab('buy')}>购买</button>
        <button style={tabStyle(tab === 'sell')} onClick={() => setTab('sell')}>出售</button>
      </div>

      {tab === 'buy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {shopState.items.map(shopItem => {
            const item = ITEMS[shopItem.itemId]
            if (!item) return null
            const canAfford = player.gold >= shopItem.price
            return (
              <div key={shopItem.itemId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', background: '#1a1428', border: '1px solid #2a2038',
                borderRadius: 3,
              }}>
                <div>
                  <div style={{ color: '#e0d0c0', fontSize: 13 }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: 11 }}>{item.description.slice(0, 40)}…</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#FFD700', fontSize: 12 }}>{shopItem.price} 金</span>
                  <button
                    style={{ ...btnGold, padding: '4px 10px', fontSize: 11, opacity: canAfford ? 1 : 0.4 }}
                    disabled={!canAfford}
                    onClick={() => {
                      if (spendGold(shopItem.price)) addItem(shopItem.itemId, 1)
                    }}
                  >购买</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'sell' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sellableItems.length === 0 && <div style={{ color: '#555', fontSize: 13 }}>没有可出售的物品</div>}
          {sellableItems.map(slot => {
            const item = ITEMS[slot.itemId]
            if (!item) return null
            const sellPrice = Math.floor(item.value * 0.6)
            return (
              <div key={slot.itemId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', background: '#1a1428', border: '1px solid #2a2038', borderRadius: 3,
              }}>
                <div>
                  <div style={{ color: '#e0d0c0', fontSize: 13 }}>{item.name} x{slot.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#FFD700', fontSize: 12 }}>{sellPrice} 金</span>
                  <button
                    style={{ ...btn, padding: '4px 10px', fontSize: 11 }}
                    onClick={() => { removeItem(slot.itemId, 1); gainGold(sellPrice) }}
                  >出售</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

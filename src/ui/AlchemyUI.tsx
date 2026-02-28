import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { ALCHEMY_RECIPES, type AlchemyRecipeData } from '../game/data/bestiary'
import { ITEMS } from '../game/data/items'
import { panelOverlay, title, closeBtn, btn, btnGold } from './styles'

export function AlchemyUI() {
  const { inventory, addItem, removeItem, closeScreen, showNotification } = useGameStore()
  const [selected, setSelected] = useState<string | null>(null)

  const recipes = Object.values(ALCHEMY_RECIPES)
  const selectedRecipe = selected ? ALCHEMY_RECIPES[selected] : null

  const canCraft = (recipeId: string): boolean => {
    const r = ALCHEMY_RECIPES[recipeId]
    if (!r) return false
    return Object.entries(r.ingredients).every(([itemId, qty]) => {
      const slot = inventory.find(s => s.itemId === itemId)
      return slot && slot.quantity >= (qty as number)
    })
  }

  const craft = (recipeId: string) => {
    const r = ALCHEMY_RECIPES[recipeId]
    if (!r || !canCraft(recipeId)) return
    Object.entries(r.ingredients).forEach(([itemId, qty]) => removeItem(itemId, qty as number))
    addItem(r.result, r.resultQuantity)
    const resultName = ITEMS[r.result]?.name ?? r.result
    showNotification(`炼制成功：${resultName} x${r.resultQuantity}`)
  }

  return (
    <div style={{ ...panelOverlay, width: 700, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={title}>炼金台 [G]</div>
        <button style={closeBtn} onClick={closeScreen}>关闭</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
        {/* Recipe list */}
        <div>
          <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 8 }}>已知配方</div>
          {recipes.map(recipe => {
            const craftable = canCraft(recipe.id)
            return (
              <div
                key={recipe.id}
                onClick={() => setSelected(recipe.id === selected ? null : recipe.id)}
                style={{
                  padding: '7px 10px', marginBottom: 4, borderRadius: 3, cursor: 'pointer',
                  background: selected === recipe.id ? '#2a1f4a' : '#1a1428',
                  border: `1px solid ${selected === recipe.id ? '#8a5aaa' : '#2a2038'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#e0d0c0', fontSize: 13 }}>{recipe.name}</span>
                  <span style={{ color: craftable ? '#44aa66' : '#cc4444', fontSize: 10 }}>
                    {craftable ? '可炼制' : '材料不足'}
                  </span>
                </div>
                <div style={{ color: '#555', fontSize: 10, marginTop: 2 }}>
                  {ITEMS[recipe.result]?.type === 'potion' ? '药水' :
                    ITEMS[recipe.result]?.type === 'oil' ? '涂油' : '炸弹'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Recipe detail */}
        {selectedRecipe ? (
          <div style={{ background: '#0d0a18', borderRadius: 4, padding: 12, border: '1px solid #2a2038' }}>
            <div style={{ color: '#FFD700', fontSize: 15, marginBottom: 4 }}>{selectedRecipe.name}</div>
            <div style={{ color: '#b0a0c0', fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{selectedRecipe.description}</div>
            <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 6 }}>所需材料：</div>
            {Object.entries(selectedRecipe.ingredients).map(([itemId, qty]) => {
              const needed = qty as number
              const slot = inventory.find(s => s.itemId === itemId)
              const have = slot?.quantity ?? 0
              const enough = have >= needed
              return (
                <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: '#e0d0c0' }}>{ITEMS[itemId]?.name ?? itemId}</span>
                  <span style={{ color: enough ? '#44aa66' : '#cc4444' }}>{have}/{needed}</span>
                </div>
              )
            })}
            <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
              产出: {ITEMS[selectedRecipe.result]?.name ?? selectedRecipe.result} x{selectedRecipe.resultQuantity}
            </div>
            <button
              style={{ ...btnGold, marginTop: 12, width: '100%', textAlign: 'center', opacity: canCraft(selectedRecipe.id) ? 1 : 0.4 }}
              onClick={() => craft(selectedRecipe.id)}
              disabled={!canCraft(selectedRecipe.id)}
            >
              炼制
            </button>
          </div>
        ) : (
          <div style={{ color: '#444', fontSize: 12, padding: 12 }}>选择配方查看详情</div>
        )}
      </div>

      {/* Inventory ingredients */}
      <div style={{ marginTop: 16, borderTop: '1px solid #2a2038', paddingTop: 12 }}>
        <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 8 }}>背包中的材料</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {inventory.filter(s => ['ingredient', 'misc'].includes(ITEMS[s.itemId]?.type ?? '')).map(slot => (
            <div key={slot.itemId} style={{
              background: '#1a1428', border: '1px solid #2a2038', borderRadius: 3,
              padding: '3px 8px', fontSize: 11, color: '#b0a0c0',
            }}>
              {ITEMS[slot.itemId]?.name ?? slot.itemId} x{slot.quantity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

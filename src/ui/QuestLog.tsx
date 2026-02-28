import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { QUESTS } from '../game/data/quests'
import { panelOverlay, title, closeBtn } from './styles'

export function QuestLog() {
  const { activeQuests, completedQuestIds, closeScreen } = useGameStore()
  const [tab, setTab] = useState<'active' | 'done'>('active')
  const [selected, setSelected] = useState<string | null>(null)

  const tabStyle = (active: boolean) => ({
    padding: '5px 14px', cursor: 'pointer', fontSize: 12,
    background: active ? '#2a1f4a' : '#1a1428',
    border: `1px solid ${active ? '#8a5aaa' : '#2a2038'}`,
    borderRadius: 3, color: active ? '#FFD700' : '#888',
  } as const)

  const questIds = tab === 'active' ? activeQuests.map(q => q.questId) : completedQuestIds
  const selectedQ = selected ? QUESTS[selected] : null
  const activeQ = selected ? activeQuests.find(q => q.questId === selected) : null

  return (
    <div style={{ ...panelOverlay, width: 680, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={title}>任务日志 [L]</div>
        <button style={closeBtn} onClick={closeScreen}>关闭</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button style={tabStyle(tab === 'active')} onClick={() => setTab('active')}>
          进行中 ({activeQuests.length})
        </button>
        <button style={tabStyle(tab === 'done')} onClick={() => setTab('done')}>
          已完成 ({completedQuestIds.length})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
        {/* Quest list */}
        <div>
          {questIds.length === 0 && <div style={{ color: '#555', fontSize: 13 }}>无任务</div>}
          {questIds.map(id => {
            const q = QUESTS[id]
            if (!q) return null
            const typeColor = q.type === 'main' ? '#FFD700' : q.type === 'contract' ? '#FF9944' : '#88CCFF'
            return (
              <div
                key={id}
                onClick={() => setSelected(id === selected ? null : id)}
                style={{
                  padding: '7px 10px', marginBottom: 4, borderRadius: 3, cursor: 'pointer',
                  background: selected === id ? '#2a1f4a' : '#1a1428',
                  border: `1px solid ${selected === id ? '#8a5aaa' : '#2a2038'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#e0d0c0', fontSize: 13 }}>{q.title}</span>
                  <span style={{ color: typeColor, fontSize: 10 }}>
                    {q.type === 'main' ? '主线' : q.type === 'contract' ? '委托' : '支线'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quest detail */}
        {selectedQ ? (
          <div style={{ background: '#0d0a18', borderRadius: 4, padding: 12, border: '1px solid #2a2038' }}>
            <div style={{ color: '#FFD700', fontSize: 15, marginBottom: 6 }}>{selectedQ.title}</div>
            <div style={{ color: '#b0a0c0', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{selectedQ.description}</div>
            <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 6 }}>任务目标：</div>
            {selectedQ.stages.map((stage, i) => {
              const isDone = activeQ ? i < activeQ.currentStage : true
              const isCurrent = activeQ ? i === activeQ.currentStage : false
              const progress = activeQ?.stageProgress[stage.id] ?? 0
              return (
                <div key={stage.id} style={{ marginBottom: 5, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: isDone ? '#44aa66' : isCurrent ? '#FFD700' : '#444', fontSize: 12, marginTop: 1 }}>
                    {isDone ? '✓' : isCurrent ? '▸' : '○'}
                  </span>
                  <div>
                    <div style={{ color: isDone ? '#555' : isCurrent ? '#e0d0c0' : '#444', fontSize: 12 }}>
                      {stage.description}
                    </div>
                    {isCurrent && stage.objective.type === 'kill' && (
                      <div style={{ color: '#888', fontSize: 11 }}>进度: {progress}/{stage.objective.count}</div>
                    )}
                    {isCurrent && stage.objective.type === 'collect' && (
                      <div style={{ color: '#888', fontSize: 11 }}>进度: {progress}/{stage.objective.count}</div>
                    )}
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: 10, padding: '6px 8px', background: '#1a1428', borderRadius: 3 }}>
              <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 4 }}>任务奖励：</div>
              <div style={{ color: '#FFD700', fontSize: 12 }}>
                {selectedQ.rewards.xp} 经验 · {selectedQ.rewards.gold} 金币
                {selectedQ.rewards.items?.length ? ` · ${selectedQ.rewards.items.length}件物品` : ''}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#444', fontSize: 12, padding: 12 }}>选择任务查看详情</div>
        )}
      </div>
    </div>
  )
}

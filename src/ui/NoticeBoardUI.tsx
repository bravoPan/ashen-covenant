import { useGameStore } from '../store/gameStore'
import { QUESTS } from '../game/data/quests'
import { panelOverlay, title, closeBtn, btnGold } from './styles'

const CONTRACT_IDS = ['contract_01', 'contract_02', 'contract_03', 'contract_04', 'contract_05']

export function NoticeBoardUI() {
  const { activeQuests, completedQuestIds, startQuest, closeScreen } = useGameStore()

  return (
    <div style={{ ...panelOverlay, width: 600, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={title}>布告栏</div>
        <button style={closeBtn} onClick={closeScreen}>关闭</button>
      </div>
      <div style={{ color: '#6a5a8a', fontSize: 11, marginBottom: 14 }}>
        村民张贴的委托与悬赏
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONTRACT_IDS.map(id => {
          const q = QUESTS[id]
          if (!q) return null
          const isActive = !!activeQuests.find(aq => aq.questId === id)
          const isDone = completedQuestIds.includes(id)
          return (
            <div key={id} style={{
              background: isDone ? '#0d1208' : '#1a1428',
              border: `1px solid ${isDone ? '#2a3a1a' : '#2a2038'}`,
              borderRadius: 4, padding: '10px 14px',
              opacity: isDone ? 0.5 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isDone ? '#555' : '#e0d0c0', fontSize: 14, marginBottom: 4 }}>{q.title}</div>
                  <div style={{ color: '#777', fontSize: 11, lineHeight: 1.6 }}>{q.description}</div>
                </div>
                <div style={{ marginLeft: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ color: '#FFD700', fontSize: 12 }}>赏金 {q.rewards.gold} 金</span>
                  {isDone ? (
                    <span style={{ color: '#44aa66', fontSize: 11 }}>✓ 已完成</span>
                  ) : isActive ? (
                    <span style={{ color: '#888', fontSize: 11 }}>进行中</span>
                  ) : (
                    <button style={{ ...btnGold, padding: '4px 10px', fontSize: 11 }} onClick={() => startQuest(id)}>
                      接受委托
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

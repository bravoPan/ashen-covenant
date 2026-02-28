import { useGameStore } from '../store/gameStore'
import { DIALOGUES } from '../game/data/dialogue'
import { QUESTS } from '../game/data/quests'
import { SHOP_INVENTORIES } from '../game/data/shopData'
import { panel, btn } from './styles'
import type { DialogueOption } from '../game/data/types'

export function DialogueBox() {
  const { activeDialogue, setDialogueNode, closeDialogue, startQuest, completeQuest, addItem, openShop, openScreen } = useGameStore()
  if (!activeDialogue) return null

  const tree = DIALOGUES[activeDialogue.treeId]
  if (!tree) return null
  const node = tree.nodes.find(n => n.id === activeDialogue.currentNodeId)
  if (!node) return null

  const handleOption = (opt: DialogueOption) => {
    if (opt.action) {
      const { type, value } = opt.action
      if (type === 'start_quest' && value) startQuest(value)
      if (type === 'complete_quest' && value) completeQuest(value)
      if (type === 'give_item' && value) addItem(value, 1)
      if (type === 'open_shop' && value) {
        const inv = SHOP_INVENTORIES[value]
        if (inv) { openShop(value, inv); return }
      }
      if (type === 'open_board') { openScreen('board'); return }
      if (type === 'set_flag' && value) useGameStore.getState().setFlag(value, true)
    }
    if (opt.next) setDialogueNode(opt.next)
    else closeDialogue()
  }

  // Node-level action
  if (node.action && !node.options?.length) {
    const { type, value } = node.action
    if (type === 'complete_quest' && value) completeQuest(value)
    if (type === 'start_quest' && value) startQuest(value)
    if (type === 'give_item' && value) addItem(value, 1)
  }

  return (
    <div style={{
      position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      width: 620, pointerEvents: 'auto', zIndex: 300,
    }}>
      <div style={{
        ...panel,
        padding: '16px 20px',
        border: '1px solid #6a4a90',
        boxShadow: '0 0 30px #00000099',
      }}>
        {/* Speaker */}
        <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>
          {node.speaker}
        </div>
        {/* Text */}
        <div style={{ color: '#e0d0c0', fontSize: 14, lineHeight: 1.7, marginBottom: 14, whiteSpace: 'pre-line' }}>
          {node.text}
        </div>
        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(node.options?.length ? node.options : [{ text: '[继续]', next: undefined }]).map((opt, i) => (
            <button
              key={i}
              style={{ ...btn, textAlign: 'left', padding: '7px 12px', fontSize: 13 }}
              onClick={() => handleOption(opt)}
            >
              ▸ {opt.text}
            </button>
          ))}
          <button style={{ ...btn, marginTop: 4, color: '#666', fontSize: 11 }} onClick={closeDialogue}>
            [Esc] 结束对话
          </button>
        </div>
      </div>
    </div>
  )
}

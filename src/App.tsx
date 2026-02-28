import { useGameStore } from './store/gameStore'
import { MainMenu } from './ui/MainMenu'
import { HUD } from './ui/HUD'
import { Inventory } from './ui/Inventory'
import { QuestLog } from './ui/QuestLog'
import { BestiaryUI } from './ui/BestiaryUI'
import { AlchemyUI } from './ui/AlchemyUI'
import { DialogueBox } from './ui/DialogueBox'
import { ShopUI } from './ui/ShopUI'
import { NoticeBoardUI } from './ui/NoticeBoardUI'
import { DeathScreen } from './ui/DeathScreen'
import { Notification } from './ui/Notification'

export function App() {
  const { phase, activeScreen } = useGameStore()

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
      {phase === 'menu' && <MainMenu />}
      {phase === 'playing' && (
        <>
          <HUD />
          {activeScreen === 'inventory' && <Inventory />}
          {activeScreen === 'questlog' && <QuestLog />}
          {activeScreen === 'bestiary' && <BestiaryUI />}
          {activeScreen === 'alchemy' && <AlchemyUI />}
          {activeScreen === 'dialogue' && <DialogueBox />}
          {activeScreen === 'shop' && <ShopUI />}
          {activeScreen === 'board' && <NoticeBoardUI />}
        </>
      )}
      {phase === 'dead' && <DeathScreen />}
      <Notification />
    </div>
  )
}

import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function Notification() {
  const { notification, clearNotification } = useGameStore()

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(clearNotification, 3000)
    return () => clearTimeout(t)
  }, [notification, clearNotification])

  if (!notification) return null

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#00000099', border: '1px solid #6a4a90',
      borderRadius: 4, padding: '10px 20px',
      color: '#FFD700', fontSize: 14, fontFamily: 'sans-serif',
      pointerEvents: 'none', zIndex: 400,
      animation: 'fadeIn 0.2s ease',
      textAlign: 'center', maxWidth: 400,
    }}>
      {notification}
    </div>
  )
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import Phaser from 'phaser'
import { GameConfig } from './game/GameConfig'
import { App } from './App'

// Start Phaser
new Phaser.Game(GameConfig)

// Mount React UI
ReactDOM.createRoot(document.getElementById('ui-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

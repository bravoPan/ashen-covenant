import type { CSSProperties } from 'react'

export const panel: CSSProperties = {
  background: 'linear-gradient(160deg, #1a1520 0%, #0d0a14 100%)',
  border: '1px solid #4a3a60',
  borderRadius: 4,
  color: '#e0d0c0',
  fontFamily: 'sans-serif',
  pointerEvents: 'auto',
}

export const panelOverlay: CSSProperties = {
  ...panel,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 200,
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 0 40px #00000099',
}

export const title: CSSProperties = {
  color: '#FFD700',
  fontWeight: 'bold',
  fontSize: 18,
  borderBottom: '1px solid #4a3a60',
  paddingBottom: 8,
  marginBottom: 12,
  letterSpacing: 2,
}

export const btn: CSSProperties = {
  background: 'linear-gradient(135deg, #2a1f3a, #1a1228)',
  border: '1px solid #6a4a90',
  borderRadius: 3,
  color: '#e0d0c0',
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'sans-serif',
  pointerEvents: 'auto',
}

export const btnGold: CSSProperties = {
  ...btn,
  border: '1px solid #FFD700',
  color: '#FFD700',
}

export const closeBtn: CSSProperties = {
  ...btn,
  fontSize: 11,
  padding: '3px 10px',
}

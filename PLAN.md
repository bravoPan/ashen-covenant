# Witcher-like RPG Game — Development Plan

## Overview

A dark fantasy RPG inspired by The Witcher series, featuring a monster hunter protagonist in a morally grey world with branching choices, alchemy/combat systems, and rich lore.

**Working Title:** *Ashen Covenant*
**Engine:** [To be decided — see Tech Stack section]
**Platform Target:** Web (browser-based), with potential desktop packaging later

---

## Core Pillars

1. **Moral Ambiguity** — No clear good/evil. Every choice has consequences.
2. **Monster Hunter Loop** — Investigate, prepare, hunt. Combat is tactical, not spammy.
3. **Deep Lore** — Bestiary, world history, faction politics.
4. **Meaningful Choices** — Dialogue branches that affect the world state.

---

## Proposed Tech Stack

### Option A — Web (Recommended for MVP)
- **Runtime:** Browser (TypeScript)
- **Framework:** [Phaser 3](https://phaser.io/) — 2D game engine with strong community
- **UI Layer:** React (overlaid on canvas for menus, dialogue, inventory)
- **State Management:** Zustand or Redux
- **Build Tool:** Vite
- **Dialogue System:** Custom JSON-driven conversation trees (Ink-compatible format)
- **Save System:** LocalStorage → later IndexedDB

### Option B — Bevy (Rust)
- I see you already have a `bevy` project locally
- Stronger performance, native desktop target
- Higher complexity for web deployment (WASM)

**Recommendation:** Start with Option A (Phaser 3) for fastest iteration. Migrate to Bevy if performance becomes a concern.

---

## Game Systems (MVP Scope)

### 1. World & Map
- Top-down 2D tilemap world (Tiled map editor compatible)
- Multiple zones: village, forest, ruins, swamp
- Day/night cycle affecting monster spawns and NPC behavior

### 2. Player Character — The Seeker
- Stats: Vitality, Stamina, Reflexes, Sign Power, Alchemy
- Equipment slots: Weapon (silver/steel), Armor, Trinkets
- Skill tree: Combat / Signs / Alchemy (mutually exclusive upgrades)

### 3. Combat System
- Real-time with pause (semi-tactical)
- Light/heavy attacks, dodge/parry
- Signs (magic abilities): 5 signs with upgradeable effects
  - Igni (fire blast), Aard (telekinetic push), Quen (shield), Axii (mind control), Yrden (trap)
- Enemy weaknesses system — wrong weapons/oils = ineffective combat
- Stamina-gated actions (no spamming)

### 4. Alchemy
- Collect herbs/monster parts in the world
- Brew potions (temporary buffs), oils (weapon coatings), bombs
- Toxicity system — too many potions = debuffs
- Recipes discovered through exploration/NPCs

### 5. Bestiary
- ~15 monster types for MVP (wolves, drowners, wraiths, golems, etc.)
- Each entry unlocked through: combat, research, NPC dialogue
- Entries describe lore, weaknesses, recommended preparation

### 6. Quest & Dialogue System
- Main questline (3 acts, ~10 quests)
- Side contracts (monster hunts posted on notice boards)
- Branching dialogue trees using JSON
- Choice flags stored in world state — NPCs remember what you did
- Morally ambiguous outcomes (no "good ending" guarantee)

### 7. Economy
- Coin from contracts, looting, selling monster parts
- Merchants with limited inventory that restocks over time
- Crafting components have weight/carry limits

### 8. Save System
- Multiple save slots
- Auto-save on zone transitions
- "New Game+" mode (carry over crafting recipes, not gear)

---

## Milestone Plan

### Milestone 0 — Proof of Concept (Week 1-2)
- [ ] Project scaffolding (Vite + Phaser 3 + TypeScript)
- [ ] Tilemap rendering with camera follow
- [ ] Player movement and basic collision
- [ ] Simple combat loop (attack, dodge, enemy AI)
- [ ] One test zone

### Milestone 1 — Core Loop (Week 3-5)
- [ ] Player stats and leveling
- [ ] 3 enemy types with AI
- [ ] Basic inventory and equipment system
- [ ] Signs system (at least 2 functional)
- [ ] Alchemy prototype (brew 3 potions)
- [ ] Simple dialogue system with one branching conversation

### Milestone 2 — World & Content (Week 6-9)
- [ ] 3 zones (village, forest, dungeon)
- [ ] Day/night cycle
- [ ] 5 side contracts
- [ ] Bestiary with 8 entries
- [ ] Notice board quest system
- [ ] Full alchemy system

### Milestone 3 — Main Story (Week 10-14)
- [ ] 3-act main questline
- [ ] Major moral choice with world-state consequences
- [ ] Faction system (basic)
- [ ] Full bestiary (15 monsters)
- [ ] UI polish (menus, HUD, map)

### Milestone 4 — Polish & Ship (Week 15-16)
- [ ] Sound effects and music
- [ ] Save/load system
- [ ] Performance optimization
- [ ] Accessibility options (text size, color blind mode)
- [ ] Deploy to web host (Vercel/Netlify)

---

## Art Direction
- **Style:** Dark pixel art (16x16 or 32x32 tiles), muted earth tones
- **Inspiration:** Stoneshard, Darkest Dungeon, early Diablo
- **Tileset Source:** Open-licensed assets (0x72, Kenney) for MVP; commission originals post-MVP
- **UI:** Gothic frame aesthetic, parchment textures, dark serif fonts

---

## Open Questions for Review

1. **Engine choice** — Phaser 3 (web, fast) vs Bevy (Rust, you already have it locally)?
2. **Perspective** — Top-down 2D (faster to build) or isometric (more cinematic)?
3. **Scope** — Should MVP be one self-contained zone/contract, or a mini full game?
4. **Multiplayer** — Out of scope for now, or worth architecting for from the start?
5. **Monetization** — Free/open source, or commercial?

---

## Repository Structure (Proposed)

```
witcher-rpg/
├── PLAN.md              # This document
├── README.md
├── src/
│   ├── scenes/          # Phaser scenes (Boot, Game, UI, etc.)
│   ├── systems/         # Combat, alchemy, dialogue, quest systems
│   ├── entities/        # Player, enemies, NPCs
│   ├── data/            # JSON: quests, dialogue, bestiary, items
│   ├── ui/              # React components for menus/HUD
│   └── utils/
├── assets/
│   ├── tilemaps/
│   ├── sprites/
│   ├── audio/
│   └── fonts/
├── public/
└── docs/                # Design docs, lore bible
```

---

*Awaiting review before implementation begins.*

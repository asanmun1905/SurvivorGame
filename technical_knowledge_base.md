# Technical Knowledge Base - SurvivorGame Project

This document provides a comprehensive technical overview of the **SurvivorGame** project. It is designed to give future AI agents and developers full context on the architecture, mechanics, logic, and assets.

---

## 1. Core Architecture & Tech Stack

- **Technology**: TypeScript, Vite, Vanilla CSS, Semantic HTML5.
- **Rendering**: Directly on 2D `CanvasRenderingContext2D`. No external game engines (like Phaser).
- **Project Structure**:
  - `/src/engine/`: Core game logic for different modes (`WaveGame.ts`, `BulletHell.ts`, `OleadasGame.ts`).
  - `/src/entities/`: Class definitions for players and enemies.
  - `index.html`: Entry point and UI/HUD container.
  - `main.ts`: Application orchestrator, handles routing and state transitions.

---

## 2. Game Mode: Wave Game (Oleadas)

The primary "Survival" loop where the player fights waves of enemies, levels up, and upgrades.

### Mechanics & Rules
- **Automatic Waves**: Round progression is automatic (20s intervals). Banners signify wave starts.
- **Enemy Archetypes**:
  - **Standard**: Balanced stats.
  - **Sprinter**: High speed, lower HP.
  - **Tank**: High HP, slower movement, colored tinting (Purple).
- **Spawning**: Enemies spawn in 4 designated corner zones with dashed-line indicators.

### Combat & Skills
- **Auto-Attack**: The player automatically attacks nearby targets based on class (Melee/Ranged).
- **Classes**:
  - **Warrior**: High HP, circular melee AoE.
  - **Mage**: Lower HP, high damage, larger skill areas.
  - **Archer**: Ranged projectiles (Arrows).
- **Skill System**: Each class has a unique "Ultimate" (e.g., Archer's Colossal Arrow).
- **AoE Implementation**: Visualized by semi-transparent colored shapes that vanish after a short lifetime.

### Economy (The Shop)
- Enemies drop Gold.
- Shop allows upgrading Max HP, Damage, Speed, and Gold/XP Gain Multipliers.
- Consumables: Potions (Full Heal) and Shields.

---

## 3. Game Mode: Bullet Hell

A specialized mode focused on precision dodging.

### Implementation Logic
- **Patterns**: Uses a random state machine to trigger `espiral`, `cortina`, `embudo`, `radial`, `lluvia`, and `laser`.
- **Laser Mechanic**: Two-phase system (Warning with dashed line -> Lethal Beam with white core).
- **Trajectory Math**: Projectiles use `Math.atan2(vy, vx)` for rotation. 
  - **Note**: Source sprites for arrows are reversed, so `+ Math.PI` (180°) is added to the rotation in the draw call to ensure they face the movement direction.

### Visual Feedback System
- **Advanced Indicators**: 1200px dashed trajectory lines with pulsing red dots allow players to anticipate spawns.
- **Screen Effects**: 
  - **Shake**: Canvas translation with random offsets (`ctx.translate`).
  - **Flash**: Red overlay with decreasing alpha (`hitFlash`).
  - **Particles**: Array-based particle emitter for "blood" bursts on hit.

---

## 4. Asset Management & Rendering

### Asset System
- **Loading**: Uses `import.meta.glob` for Vite-aware asset resolution.
- **State Management**: `assetsLoaded` Set ensures no drawing happens before images are ready.

### Sprite Handling (Individual vs Sheets)
- **Automatic Sheet Detection**: The drawing logic (`drawSprite`) checks if `img.width > img.height * 1.2`.
- **Clipping Logic**: If a sheet is detected, it calculates frame width based on height (assuming square frames) and clips using `this.frame % cols`.
- **Asset Paths**: 
  - Player: `assets/BuenoMelee/Sprites/`
  - Projectiles: `assets/weapons/flecha.png`

---

## 5. Key Algorithms & Implementation Details

### Collision Detection
- **Circle-to-Circle**: `Math.hypot(x2-x1, y2-y1) < r1 + r2`.
- **Point-to-Line (Lasers)**: 
  ```typescript
  const distToLine = Math.abs(px * sinA - py * cosA);
  ```
  Calculated using the projection onto the perpendicular of the laser's angle.

### Player Animation State Machine
Synchronized across modes using:
- **State**: `idle` / `run`.
- **MoveMode**: `up`, `down`, or `horizontal` (based on movement vectors).
- **Direction**: `1` (right) or `-1` (left).

### Screen Shake Implementation
```typescript
if (this.screenShake > 0) {
    const sx = (Math.random() - 0.5) * this.screenShake;
    const sy = (Math.random() - 0.5) * this.screenShake;
    ctx.translate(sx, sy);
}
// After drawing
ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
```

### Boss Plasma Beam (Wave Mode)
- **Visual Synthesis**: Combines multiple layers including a broad outer glow, a vibrant inner beam, and a white "hot" core.
- **Dynamic Effects**:
  - **Flicker**: Uses `Math.sin(time * 60)` to oscillate width rapidly.
  - **Energy Particles**: Procedural white rectangles travel along the beam's axis to simulate fast-moving plasma.
  - **Eye Glow**: A radial gradient at the boss's eye creates a high-intensity focal point for the attack.

---

## 6. Critical Technical Notes for AI
- **Performance**: The game runs at a variable framerate linked to `requestAnimationFrame` with a `dt` (Delta Time) cap of 0.05s to prevent logic jumps.
- **UI Interaction**: HUD elements are updated via callbacks (`onLivesChange`, `onGoldChange`) to decouple game logic from DOM manipulation.
- **Deployment**: Runs on Vite. Default ports vary if multiple instances are active (Check logs for `local: http://localhost:PORT`).

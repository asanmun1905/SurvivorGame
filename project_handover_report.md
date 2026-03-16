# Technical Handover Report - SurvivorGame Project

## 1. Project Context
This is a 2D web-based game project built with **TypeScript** and **Vite**. The game features multiple modes, including a real-time action survival mode (Oleadas) and a Bullet Hell mode.

### Architecture Overview
- **Engine**: Custom canvas-based game loop.
- **Rendering**: Directly on 2D `CanvasRenderingContext2D`.
- **Game Modes**:
  - `WaveGame.ts`: The primary survival mode (Oleadas) with auto-attacks, shop, and waves.
  - `BulletHell.ts`: Specialized dodging mode.
  - `Tablero.ts`: Simulation-style grid mode.

## 2. Recent Major Changes (March 2026)

### Visual Scaling & Proportions
- **Character Sizes**: Player and enemy sprites have been scaled up for better visibility (Player ~80px, Tanks ~100px).
- **Attack Visuals**: Character attack ranges are now visually represented by semi-transparent areas of effect (AoE) that appear only during the attack and disappear immediately afterward.
- **Weapon Assets**: Base arrow size was increased for better visibility. The Archer's "Colossal Arrow" skill now renders a significantly larger (4.0x) version of the arrow sprite.

### Player Sprite Handling
- **Sprite Sheet Fix**: The player's `idle_down.png` and other frames are stored as sprite sheets (e.g., 8 frames wide). The drawing logic in both `WaveGame.ts` and `BulletHell.ts` was updated to clip and draw only a single frame to avoid "vertical lines" rendering issues.

### Mechanical Bug Fixes
- **Attack Sticking**: Resolved an issue where attack visuals would persist indefinitely. This was fixed by ensuring `updateAoEEffects` correctly decrements life and by gating `spawnAoE` inside the attack timers.
- **Obstacle Persistence**: Moved obstacle spawning to the game's start to prevent accumulation or multiplication between waves.
- **Automated Waves**: Waves in `WaveGame.ts` now transition automatically after defined intervals (20s) with on-screen banners, bypassing intermediate menus.

## 3. Component Reference

| File | Responsibility |
| :--- | :--- |
| `WaveGame.ts` | Main logic for "Oleadas" mode. Handles player movement, auto-attack timers, enemy AI states (idle, run, follow), and visuals. |
| `BulletHell.ts` | Manages the Bullet Hell mode, bullet patterns (spiral, curtain, etc.), and player collision. |
| `Tablero.ts` | Grid-based simulation logic. Cell size was recently doubled to 40 for better visibility. |
| `SurvivorGame.ts` | Base class for general survivor-style entity management. |

## 4. Technical Notes for Future Development
- **Asset Loading**: Assets are loaded via `Image()` objects. Always check `assetsLoaded.has(key)` before calling `drawImage`.
- **AoE Spawning**: Use `this.spawnAoE(x, y, radius, life, color)` to trigger visual feedback. It is automatically cleaned up by `updateAoEEffects`.
- **Navigation**: Enemies use a detection radius. If they lose sight or haven't spotted the player, they wander randomly within corner spawn zones.
- **Canvas Coordinates**: All game logic is in pixel space. Standard resolution is dynamic based on container width/height.

## 5. Current Project Status
- **Health**: Fully functional. No known critical bugs.
- **Visuals**: Updated to professional "wow" standards with glows, smooth transitions, and properly handled sprite assets.
- **Consistency**: High. Visual improvements were applied across all applicable modes.

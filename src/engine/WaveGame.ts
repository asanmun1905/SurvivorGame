/**
 * WaveGame.ts — Real-time active wave survival game.
 * 
 * Architecture inspired by Dungeon Tide:
 *  - Player controlled by WASD (pixel movement, continuous)
 *  - Enemies spawn from 4 corner zones each wave
 *  - Auto-attack: player attacks nearest enemy in range periodically
 *  - Right sidebar shop (permanent upgrades + consumables)
 *  - Bottom HUD: HP bar, damage, kills, gold
 *  - Wave timer counted up; wave ends when all enemies die or player dies
 */

import bgImgUrl from '../../assets/Background/background.png';
import maloImgUrl from '../../assets/MaloMelee/IdleFront-removebg-preview.png';
import malo2ImgUrl from '../../assets/MaloRango/Necromancer_creativekind-Sheet.png';
import buenoImgUrl from '../../assets/BuenoMelee/Sprites/IDLE/idle_down.png';
import flechaImgUrl from '../../assets/weapons/flecha.png';
import obsImgUrl from '../../assets/Obstacle/82cfbcc1-c0ad-4c07-91ae-ca682d039cb1_unnamed_1_-removebg-preview.png';

// Import Mallomelee frames
const MALO_MELEE_ASSETS = {
    idleFront: import.meta.glob('../../assets/MaloMelee/IdleFront-removebg-preview.png', { eager: true, as: 'url' }),
    attack: [
        import.meta.glob('../../assets/MaloMelee/Ataque1-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque2-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque3-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque4-removebg-preview.png', { eager: true, as: 'url' })
    ],
    runRight: [
        import.meta.glob('../../assets/MaloMelee/RunRight1-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight2-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight3-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight4-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight5-removebg-preview.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight6-removebg-preview.png', { eager: true, as: 'url' })
    ],
    runBack: [
        import.meta.glob('../../assets/MaloMelee/RunBack1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack4.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack5.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack6.png', { eager: true, as: 'url' })
    ],
    runFront: [
        import.meta.glob('../../assets/MaloMelee/RunFront1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront4.png', { eager: true, as: 'url' }),
    ]
};

// ─────────────────── Types ───────────────────
export type ClaseWave = 'guerrero' | 'arquero' | 'explorador';

interface ClaseStats {
    nombre: string;
    emoji: string;
    hp: number;
    speed: number;
    damage: number;
    attackRange: number;
    attackCooldown: number; // seconds
    skill: string;
    skillCooldown: number;
    color: string;
}

const CLASES_STATS: Record<ClaseWave, ClaseStats> = {
    guerrero: {
        nombre: 'Guerrero', emoji: '⚔️',
        hp: 300, speed: 140, damage: 40, attackRange: 120, attackCooldown: 0.6,
        skill: 'Golpe Sísmico', skillCooldown: 10, color: '#ef4444'
    },
    arquero: {
        nombre: 'Arquero', emoji: '🏹',
        hp: 120, speed: 200, damage: 20, attackRange: 300, attackCooldown: 0.4,
        skill: 'Flecha Colosal', skillCooldown: 8, color: '#22c55e'
    },
    explorador: {
        nombre: 'Explorador', emoji: '🗺️',
        hp: 200, speed: 165, damage: 30, attackRange: 200, attackCooldown: 0.5,
        skill: 'Esquivar', skillCooldown: 6, color: '#d4af37'
    }
};

interface Enemy {
    id: number;
    x: number; y: number;
    hp: number; maxHp: number;
    speed: number; damage: number;
    assetKey: 'malo' | 'malo2';
    isTank: boolean; isSprinter: boolean;
    attackCooldown: number;
    attackTimer: number;
    hitFlash: number; // seconds of red flash on hit
    // Animation state
    state: 'idle' | 'run' | 'attack';
    direction: number; // -1 for left, 1 for right
    frame: number;
    frameTimer: number;
    detectionRadius: number;
    spottedPlayer: boolean;
    wanderTarget: { x: number, y: number } | null;
    wanderWaitTimer: number;
    moveMode: 'horizontal' | 'up' | 'down';
}

interface Obstacle {
    x: number; y: number;
    radius: number;
}

interface AoEEffect {
    x: number; y: number;
    radius: number;
    life: number;
    maxLife: number;
    color: string;
}

interface Projectile {
    x: number; y: number;
    tx: number; ty: number; // target when fired
    vx: number; vy: number;
    damage: number;
    fromPlayer: boolean;
    radius: number;
    life: number; // max seconds to live
    color: string;
    assetKey?: string;
    rotation?: number;
    scale?: number;
}

interface DamageNumber {
    x: number; y: number;
    val: number; life: number;
    color: string;
}

interface Player {
    x: number; y: number;
    hp: number; maxHp: number;
    speed: number;
    damage: number;
    attackRange: number;
    attackCooldown: number;
    attackTimer: number;
    skillCooldown: number;
    skillTimer: number;
    skillActive: boolean; // invincible during skill
    skillActiveTimer: number;
    kills: number;
    gold: number;
    dmgBoost: number; // multiplier
    speedBoost: number;
    invincible: boolean;
    invincibleTimer: number;
    shield: number;
}

export interface WaveCallbacks {
    onWaveChange: (n: number) => void;
    onHpChange: (hp: number, max: number) => void;
    onKillsChange: (k: number) => void;
    onGoldChange: (g: number) => void;
    onTimeChange: (t: number) => void;
    onEnemiesChange: (n: number) => void;
    onGameOver: (kills: number, oleada: number) => void;
    onWaveEnd: (oleada: number, gold: number) => void;
    onSkillCooldown: (ready: boolean, pct: number) => void;
    onStatusMsg: (msg: string) => void;
}

export class WaveGame {
    private ctx: CanvasRenderingContext2D;
    private W: number;
    private H: number;

    // Assets
    private assets: Map<string, HTMLImageElement> = new Map();
    private assetsLoaded: Set<string> = new Set();

    // State
    private player!: Player;
    private clase!: ClaseStats;
    private enemies: Enemy[] = [];
    private obstacles: Obstacle[] = [];
    private projectiles: Projectile[] = [];
    private damageNums: DamageNumber[] = [];
    private aoeEffects: AoEEffect[] = [];
    private wave: number = 0;
    private waveTime: number = 0;
    private totalTime: number = 0;
    private running: boolean = false;
    private waveActive: boolean = false;
    private enemigoIdCounter: number = 0;
    private waveStartTimer: number = 0;
    private readonly WAVE_INTERVAL = 20;

    // Corner spawn zones (as fractions of W/H)
    private readonly SPAWN_MARGIN = 0.15;

    // Key state
    private keys: { [k: string]: boolean } = {};
    private keyDownHandler: (e: KeyboardEvent) => void;
    private keyUpHandler: (e: KeyboardEvent) => void;

    // RAF
    private frameId: number = 0;
    private lastTime: number = 0;

    private callbacks: WaveCallbacks;

    constructor(canvas: HTMLCanvasElement, claseKey: ClaseWave, callbacks: WaveCallbacks) {
        this.ctx = canvas.getContext('2d')!;
        this.W = canvas.width;
        this.H = canvas.height;
        this.callbacks = callbacks;
        this.clase = CLASES_STATS[claseKey];

        this.loadAssets();
        this.initPlayer();

        this.keyDownHandler = (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'e' || e.key === 'E') this.activateSkill();
            if (['arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) e.preventDefault();
        };
        this.keyUpHandler = (e) => { this.keys[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    }

    private loadAssets(): void {
        const map: Record<string, string> = {
            bg: bgImgUrl, malo: maloImgUrl, malo2: malo2ImgUrl, bueno: buenoImgUrl, flecha: flechaImgUrl, obstaculo: obsImgUrl
        };
        for (const [k, src] of Object.entries(map)) {
            const img = new Image();
            img.src = src;
            img.onload = () => this.assetsLoaded.add(k);
            this.assets.set(k, img);
        }

        // Load melee animations
        const meleeFrames = [
            { key: 'malo_idle', src: Object.values(MALO_MELEE_ASSETS.idleFront)[0] as string },
            ...MALO_MELEE_ASSETS.attack.map((f, i) => ({ key: `malo_attack_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runRight.map((f, i) => ({ key: `malo_run_side_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runBack.map((f, i) => ({ key: `malo_run_up_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runFront.map((f, i) => ({ key: `malo_run_down_${i}`, src: Object.values(f)[0] as string }))
        ];

        for (const frame of meleeFrames) {
            const img = new Image();
            img.src = frame.src;
            img.onload = () => this.assetsLoaded.add(frame.key);
            this.assets.set(frame.key, img);
        }
    }

    private initPlayer(): void {
        const c = this.clase;
        this.player = {
            x: this.W / 2, y: this.H / 2,
            hp: c.hp, maxHp: c.hp,
            speed: c.speed, damage: c.damage,
            attackRange: c.attackRange,
            attackCooldown: c.attackCooldown,
            attackTimer: 0,
            skillCooldown: c.skillCooldown,
            skillTimer: 0,
            skillActive: false, skillActiveTimer: 0,
            kills: 0, gold: 100,
            dmgBoost: 1, speedBoost: 1,
            invincible: false, invincibleTimer: 0,
            shield: 0
        };
        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
        this.callbacks.onGoldChange(this.player.gold);
    }

    /** Start the game loop. First wave launches automatically. */
    public start(): void {
        this.running = true;
        this.lastTime = performance.now();
        this.spawnObstacles();
        this.startWave();
        this.loop(this.lastTime);
    }

    public stop(): void {
        this.running = false;
        cancelAnimationFrame(this.frameId);
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
    }

    // ─────────────── Wave Management ───────────────────────────────

    private startWave(): void {
        this.wave++;
        this.waveTime = 0;
        this.waveActive = true;
        this.waveStartTimer = this.WAVE_INTERVAL; // Start timer for next wave
        
        // No clear enemies or projectiles - they persist across waves
        
        this.callbacks.onWaveChange(this.wave);
        this.callbacks.onStatusMsg(`OLEADA ${this.wave}`);
        this.spawnEnemiesForWave();
    }

    private spawnObstacles(): void {
        const count = 5 + Math.floor(this.wave / 2);
        for (let i = 0; i < count; i++) {
            let x, y, dist;
            do {
                x = Math.random() * (this.W - 100) + 50;
                y = Math.random() * (this.H - 100) + 50;
                dist = Math.hypot(x - this.player.x, y - this.player.y);
            } while (dist < 150);

            this.obstacles.push({ x, y, radius: 30 + Math.random() * 20 });
        }
    }

    private spawnEnemiesForWave(): void {
        const base = 4 + this.wave * 2;
        const tanks = Math.floor(this.wave / 3);
        const sprinters = Math.floor(this.wave / 2);

        const total = base + tanks + sprinters;
        const spawnDelay = 400;

        // Stagger spawns over ~3 seconds
        for (let i = 0; i < total; i++) {
            setTimeout(() => {
                if (!this.running) return;
                const isTank = i < tanks;
                const isSprinter = !isTank && i < tanks + sprinters;
                const pos = this.getCornerSpawnPos();

                const hp = isTank ? (240 + this.wave * 25) : isSprinter ? (30 + this.wave * 7) : (75 + this.wave * 12);
                const speed = isTank ? 45 : isSprinter ? 130 : (70 + this.wave * 4);
                const damage = isTank ? 35 : isSprinter ? 10 : 18;
                const assetKey = isSprinter ? 'malo2' : 'malo';

                this.enemies.push({
                    id: this.enemigoIdCounter++,
                    x: pos.x, y: pos.y,
                    hp, maxHp: hp, speed, damage, assetKey,
                    isTank, isSprinter,
                    attackCooldown: isTank ? 1.0 : 0.6,
                    attackTimer: Math.random() * 0.6,
                    hitFlash: 0,
                    state: 'idle',
                    direction: 1,
                    frame: 0,
                    frameTimer: 0,
                    detectionRadius: 180 + Math.random() * 40,
                    spottedPlayer: false,
                    wanderTarget: null,
                    wanderWaitTimer: Math.random() * 2,
                    moveMode: 'horizontal'
                });
                this.callbacks.onEnemiesChange(this.enemies.length);
            }, i * spawnDelay);
        }
    }

    private getCornerSpawnPos(): { x: number, y: number } {
        const m = Math.floor(this.SPAWN_MARGIN * Math.min(this.W, this.H));
        const corners = [
            { x: Math.random() * m, y: Math.random() * m },
            { x: this.W - Math.random() * m, y: Math.random() * m },
            { x: Math.random() * m, y: this.H - Math.random() * m },
            { x: this.W - Math.random() * m, y: this.H - Math.random() * m }
        ];
        return corners[Math.floor(Math.random() * 4)];
    }

    // ─────────────── Main Loop ───────────────────────────────

    private loop(timestamp: number): void {
        if (!this.running) return;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();
        this.frameId = requestAnimationFrame((t) => this.loop(t));
    }

    private update(dt: number): void {
        if (!this.running) return;
        this.waveTime += dt;
        this.totalTime += dt;
        this.callbacks.onTimeChange(this.totalTime);

        // Wave auto-start timer
        if (this.waveStartTimer > 0) {
            this.waveStartTimer -= dt;
            if (this.waveStartTimer <= 0) {
                this.startWave();
            }
        }

        this.updatePlayer(dt);
        this.updateEnemies(dt);
        this.updateProjectiles(dt);
        this.updateDamageNumbers(dt);
        this.updateAoEEffects(dt);
    }

    private updatePlayer(dt: number): void {
        const p = this.player;

        // Movement — WASD + arrows
        let dx = 0, dy = 0;
        if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
        if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
        if (this.keys['d'] || this.keys['arrowright']) dx += 1;
        if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
        const spd = p.speed * p.speedBoost;
        const nextX = p.x + dx * spd * dt;
        const nextY = p.y + dy * spd * dt;

        if (!this.checkObstacleCollision(nextX, nextY, 20)) {
            p.x = Math.max(10, Math.min(this.W - 10, nextX));
            p.y = Math.max(10, Math.min(this.H - 10, nextY));
        }

        // Invincibility countdown
        if (p.invincible) {
            p.invincibleTimer -= dt;
            if (p.invincibleTimer <= 0) p.invincible = false;
        }
        if (p.skillActive) {
            p.skillActiveTimer -= dt;
            if (p.skillActiveTimer <= 0) p.skillActive = false;
        }

        // Skill cooldown
        if (p.skillTimer > 0) {
            p.skillTimer -= dt;
            const pct = Math.max(0, p.skillTimer / p.skillCooldown);
            this.callbacks.onSkillCooldown(p.skillTimer <= 0, pct);
        }

        // Auto attack
        p.attackTimer -= dt;
        if (p.attackTimer <= 0) {
            const isWarrior = this.clase.nombre === 'Guerrero';
            const nearest = this.findNearestEnemy(p.x, p.y, p.attackRange);
            
            if (nearest || isWarrior) {
                p.attackTimer = p.attackCooldown;
                const isArcher = this.clase.nombre === 'Arquero';
                
                if (nearest) {
                    this.fireProjectileAt(p.x, p.y, nearest.x, nearest.y, p.damage * p.dmgBoost, true, isArcher ? 'flecha' : undefined);
                }
                
                // Attack AoE visual feedback
                if (isWarrior) {
                    this.spawnAoE(p.x, p.y, p.attackRange, 0.2, 'rgba(239, 68, 68, 0.25)');
                } else if (isArcher) {
                    this.spawnAoE(p.x, p.y, p.attackRange, 0.2, 'rgba(34, 197, 94, 0.15)');
                }
            }
        }
    }

    private activateSkill(): void {
        const p = this.player;
        if (p.skillTimer > 0) return;
        p.skillTimer = p.skillCooldown;
        p.skillActive = true;
        p.skillActiveTimer = 1.5;

        // Skill effect: AOE burst — damage all enemies in 2× range
        const range = p.attackRange * 2;
        for (const e of this.enemies) {
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (d <= range) {
                const dmg = p.damage * p.dmgBoost * 3;
                e.hp -= dmg;
                e.hitFlash = 0.3;
                this.spawnDamageNumber(e.x, e.y, Math.round(dmg), '#ffd700');
            }
        }
        
        // Visual for skill
        if (this.clase.nombre === 'Guerrero') {
            this.spawnAoE(p.x, p.y, range, 0.5, 'rgba(239, 68, 68, 0.35)');
        } else if (this.clase.nombre === 'Arquero') {
            // Archer skill: large arrow
            const nearest = this.findNearestEnemy(p.x, p.y, 1000);
            if (nearest) {
                // Skil projectile is MUCH bigger and hits all in its path (conceptual)
                // For simplicity, we fire one big arrow and the global loop handles dmg
                this.fireProjectileAt(p.x, p.y, nearest.x, nearest.y, p.damage * p.dmgBoost * 5, true, 'flecha', 4.0);
                this.spawnAoE(p.x, p.y, range, 0.5, 'rgba(34, 197, 94, 0.3)');
            } else {
                 this.spawnAoE(p.x, p.y, range, 0.5, 'rgba(34, 197, 94, 0.3)');
            }
        }
        
        this.cleanDeadEnemies();
        this.callbacks.onStatusMsg(`✨ ${this.clase.skill}`);
    }

    private updateEnemies(dt: number): void {
        const p = this.player;

        for (const e of this.enemies) {
            if (e.hitFlash > 0) e.hitFlash -= dt;

            const dxPl = p.x - e.x;
            const dyPl = p.y - e.y;
            const dPl = Math.hypot(dxPl, dyPl);

            // Spot logic
            if (!e.spottedPlayer && dPl < e.detectionRadius) {
                e.spottedPlayer = true;
                e.wanderTarget = null;
            }

            if (e.spottedPlayer) {
                const eSize = e.isTank ? 75 : e.isSprinter ? 40 : 55;
                const pSize = 60;
                const attackThreshold = (eSize + pSize) * 0.45;

                if (dPl > attackThreshold) {
                    e.state = 'run';
                    const moveX = (dxPl / dPl) * e.speed * dt;
                    const moveY = (dyPl / dPl) * e.speed * dt;

                    // Directional mode
                    if (Math.abs(moveY) > Math.abs(moveX) * 1.5) {
                        e.moveMode = moveY < 0 ? 'up' : 'down';
                    } else {
                        e.moveMode = 'horizontal';
                        if (Math.abs(dxPl) > 2) e.direction = dxPl > 0 ? 1 : -1;
                    }

                    if (!this.checkObstacleCollision(e.x + moveX, e.y + moveY, 20)) {
                        e.x += moveX;
                        e.y += moveY;
                    }
                } else {
                    // Melee attack range
                    e.state = 'attack';
                    e.attackTimer -= dt;
                    if (e.attackTimer <= 0) {
                        e.attackTimer = e.attackCooldown;
                        if (!p.invincible && !p.skillActive) {
                            let dmg = e.damage;
                            if (p.shield > 0) {
                                const absorbed = Math.min(p.shield, dmg);
                                p.shield -= absorbed;
                                dmg -= absorbed;
                            }
                            p.hp -= dmg;
                            p.invincible = true;
                            p.invincibleTimer = 0.5;
                            this.callbacks.onHpChange(p.hp, p.maxHp);
                            this.spawnDamageNumber(p.x - 20, p.y - 30, dmg, '#ef4444');

                            if (p.hp <= 0) {
                                this.running = false;
                                this.draw();
                                setTimeout(() => this.callbacks.onGameOver(p.kills, this.wave), 300);
                            }
                        }
                    }
                }
            } else {
                // Wander logic
                if (e.wanderTarget) {
                    e.state = 'run';
                    const dxW = e.wanderTarget.x - e.x;
                    const dyW = e.wanderTarget.y - e.y;
                    const dW = Math.hypot(dxW, dyW);
                    
                    if (dW > 5) {
                        const moveX = (dxW / dW) * (e.speed * 0.6) * dt;
                        const moveY = (dyW / dW) * (e.speed * 0.6) * dt;

                        // Directional mode
                        if (Math.abs(moveY) > Math.abs(moveX) * 1.5) {
                            e.moveMode = moveY < 0 ? 'up' : 'down';
                        } else {
                            e.moveMode = 'horizontal';
                            if (Math.abs(dxW) > 2) e.direction = dxW > 0 ? 1 : -1;
                        }

                        if (!this.checkObstacleCollision(e.x + moveX, e.y + moveY, 20)) {
                            e.x += moveX;
                            e.y += moveY;
                        } else {
                            e.wanderTarget = null;
                            e.wanderWaitTimer = 1 + Math.random() * 2;
                        }
                    } else {
                        e.wanderTarget = null;
                        e.wanderWaitTimer = 1 + Math.random() * 2;
                    }
                } else {
                    e.state = 'idle';
                    e.wanderWaitTimer -= dt;
                    if (e.wanderWaitTimer <= 0) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 50 + Math.random() * 100;
                        e.wanderTarget = {
                            x: Math.max(20, Math.min(this.W - 20, e.x + Math.cos(angle) * dist)),
                            y: Math.max(20, Math.min(this.H - 20, e.y + Math.sin(angle) * dist))
                        };
                    }
                }
            }

            // Animation update
            e.frameTimer += dt;
            const fps = e.state === 'attack' ? 10 : 12;
            if (e.frameTimer > 1 / fps) {
                e.frameTimer = 0;
                if (e.state === 'idle') e.frame = 0;
                else if (e.state === 'run') {
                    if (e.moveMode === 'up') e.frame = (e.frame + 1) % 6;
                    else if (e.moveMode === 'down') e.frame = (e.frame + 1) % 4;
                    else e.frame = (e.frame + 1) % 6;
                }
                else if (e.state === 'attack') e.frame = (e.frame + 1) % 4;
            }
        }
    }

    private checkObstacleCollision(x: number, y: number, radius: number): boolean {
        for (const obs of this.obstacles) {
            const d = Math.hypot(x - obs.x, y - obs.y);
            if (d < radius + obs.radius) return true;
        }
        return false;
    }

    private updateAoEEffects(dt: number): void {
        for (const a of this.aoeEffects) {
            a.life -= dt;
        }
        this.aoeEffects = this.aoeEffects.filter(a => a.life > 0);
    }

    private updateProjectiles(dt: number): void {
        const SPEED = 360;
        for (const proj of this.projectiles) {
            proj.x += proj.vx * SPEED * dt;
            proj.y += proj.vy * SPEED * dt;
            proj.life -= dt;
        }

        // Check projectile → enemy hits
        const projToRemove = new Set<Projectile>();
        const enemiesToRemove = new Set<number>();

        for (const proj of this.projectiles) {
            if (!proj.fromPlayer || proj.life <= 0) continue;
            for (const e of this.enemies) {
                if (enemiesToRemove.has(e.id)) continue;
                const d = Math.hypot(proj.x - e.x, proj.y - e.y);
                if (d < 16 + proj.radius) {
                    e.hp -= proj.damage;
                    e.hitFlash = 0.2;
                    this.spawnDamageNumber(e.x, e.y - 10, Math.round(proj.damage), '#fde047');
                    projToRemove.add(proj);
                    if (e.hp <= 0) {
                        enemiesToRemove.add(e.id);
                        this.player.kills++;
                        const gold = e.isTank ? 15 : e.isSprinter ? 8 : 5;
                        this.player.gold += gold;
                        this.callbacks.onKillsChange(this.player.kills);
                        this.callbacks.onGoldChange(this.player.gold);
                        this.spawnDamageNumber(e.x, e.y - 30, gold, '#22c55e');
                    }
                    break;
                }
            }
        }

        this.enemies = this.enemies.filter(e => !enemiesToRemove.has(e.id));
        this.projectiles = this.projectiles.filter(p => !projToRemove.has(p) && p.life > 0);
        this.callbacks.onEnemiesChange(this.enemies.length);
    }

    private cleanDeadEnemies(): void {
        const before = this.enemies.length;
        this.enemies = this.enemies.filter(e => {
            if (e.hp <= 0) {
                this.player.kills++;
                const gold = e.isTank ? 15 : e.isSprinter ? 8 : 5;
                this.player.gold += gold;
                return false;
            }
            return true;
        });
        if (this.enemies.length !== before) {
            this.callbacks.onKillsChange(this.player.kills);
            this.callbacks.onGoldChange(this.player.gold);
            this.callbacks.onEnemiesChange(this.enemies.length);
        }
    }

    private updateDamageNumbers(dt: number): void {
        for (const n of this.damageNums) {
            n.y -= 30 * dt;
            n.life -= dt;
        }
        this.damageNums = this.damageNums.filter(n => n.life > 0);
    }

    private fireProjectileAt(fromX: number, fromY: number, tx: number, ty: number, damage: number, fromPlayer: boolean, assetKey?: string, scale: number = 1.0): void {
        const dx = tx - fromX;
        const dy = ty - fromY;
        const d = Math.hypot(dx, dy) || 1;
        this.projectiles.push({
            x: fromX, y: fromY,
            tx, ty,
            vx: dx / d, vy: dy / d,
            damage,
            fromPlayer,
            radius: fromPlayer ? (assetKey ? 12 * scale : 8) : 9,
            life: 1.5,
            color: fromPlayer ? (this.clase.color) : '#f97316',
            assetKey,
            rotation: Math.atan2(dy, dx),
            scale
        });
    }

    private findNearestEnemy(px: number, py: number, range: number): Enemy | null {
        let nearest: Enemy | null = null;
        let minD = range;
        for (const e of this.enemies) {
            const d = Math.hypot(e.x - px, e.y - py);
            if (d < minD) { minD = d; nearest = e; }
        }
        return nearest;
    }

    private spawnDamageNumber(x: number, y: number, val: number, color: string = '#fde047'): void {
        this.damageNums.push({ x, y, val, life: 0.9, color });
    }

    private spawnAoE(x: number, y: number, radius: number, life: number, color: string): void {
        this.aoeEffects.push({ x, y, radius, life, maxLife: life, color });
    }

    // ─────────────── Drawing ───────────────────────────────

    private draw(): void {
        const ctx = this.ctx;
        const W = this.W, H = this.H;

        // Background
        const bg = this.assets.get('bg');
        if (bg && this.assetsLoaded.has('bg')) {
            ctx.drawImage(bg, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#1a1210';
            ctx.fillRect(0, 0, W, H);
        }

        // Spawn zones — red corners
        this.drawSpawnZones();

        // Obstacles
        this.drawObstacles();

        // Player
        if (this.player.hp > 0) {
            this.drawPlayer();
        }

        // Enemies
        for (const e of this.enemies) this.drawEnemy(e);

        // Projectiles
        for (const p of this.projectiles) {
            ctx.save();
            ctx.translate(p.x, p.y);
            if (p.rotation !== undefined) ctx.rotate(p.rotation);
            
            if (p.assetKey && this.assets.has(p.assetKey)) {
                const img = this.assets.get(p.assetKey)!;
                const sw = 48 * (p.scale || 1);
                const sh = 20 * (p.scale || 1);
                ctx.drawImage(img, -sw/2, -sh/2, sw, sh);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.fill();
            }
            ctx.restore();
        }

        // AoE Effects
        for (const a of this.aoeEffects) {
            ctx.save();
            ctx.globalAlpha = (a.life / a.maxLife) * 0.6;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
            ctx.fillStyle = a.color;
            ctx.fill();
            ctx.restore();
        }

        // Damage numbers
        for (const n of this.damageNums) {
            ctx.save();
            ctx.globalAlpha = n.life / 0.9;
            ctx.fillStyle = n.color;
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String(Math.round(n.val)), n.x, n.y);
            ctx.restore();
        }
    }

    private drawSpawnZones(): void {
        const ctx = this.ctx;
        const m = Math.floor(this.SPAWN_MARGIN * Math.min(this.W, this.H));
        ctx.save();
        ctx.strokeStyle = 'rgba(239,68,68,0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        // 4 corners
        const corners = [
            [0, 0], [this.W - m, 0], [0, this.H - m], [this.W - m, this.H - m]
        ];
        for (const [cx, cy] of corners) {
            ctx.strokeRect(cx, cy, m, m);
        }
        ctx.setLineDash([]);
        ctx.restore();
    }

    private drawObstacles(): void {
        const ctx = this.ctx;
        const img = this.assets.get('obstaculo');
        for (const obs of this.obstacles) {
            if (img && this.assetsLoaded.has('obstaculo')) {
                ctx.drawImage(img, obs.x - obs.radius, obs.y - obs.radius, obs.radius * 2, obs.radius * 2);
            } else {
                ctx.beginPath();
                ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#475569';
                ctx.fill();
            }
        }
    }

    private drawPlayer(): void {
        const p = this.player;
        const ctx = this.ctx;
        const SIZE = 80;
        const blink = p.invincible && Math.floor(p.invincibleTimer * 10) % 2 === 0;

        if (!blink) {
            // Optional: Draw a subtle indicator ONLY during skill
            if (p.skillActive) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, SIZE * 0.9, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,215,0,0.25)';
                ctx.fill();
            }

            const img = this.assets.get('bueno');
            if (img && this.assetsLoaded.has('bueno')) {
                // idle_down.png is a sprite sheet with 8 frames
                const frameW = img.width / 8;
                ctx.drawImage(img, 
                    0, 0, frameW, img.height, 
                    p.x - SIZE / 2, p.y - SIZE / 2, SIZE, SIZE
                );
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, SIZE / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.clase.color;
                ctx.fill();
            }

            // HP bar
            const barW = 36;
            const filled = (p.hp / p.maxHp) * barW;
            ctx.fillStyle = '#000000aa';
            ctx.fillRect(p.x - barW / 2 - 1, p.y - SIZE - 10, barW + 2, 7);
            ctx.fillStyle = p.hp > p.maxHp * 0.5 ? '#22c55e' : p.hp > p.maxHp * 0.25 ? '#eab308' : '#ef4444';
            ctx.fillRect(p.x - barW / 2, p.y - SIZE - 9, filled, 5);

            // Skill active ring
            if (p.skillActive) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.attackRange * 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255,215,0,0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    private drawEnemy(e: Enemy): void {
        const ctx = this.ctx;
        const size = e.isTank ? 100 : e.isSprinter ? 55 : 75;

        // Hit flash
        if (e.hitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = Math.min(1, e.hitFlash * 5);
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(e.x - size / 2, e.y - size / 2, size, size);
            ctx.restore();
        }

        const imgKey = e.state === 'idle' ? 'malo_idle' : 
                       e.state === 'run' ? (
                           e.moveMode === 'up' ? `malo_run_up_${e.frame}` :
                           e.moveMode === 'down' ? `malo_run_down_${e.frame}` :
                           `malo_run_side_${e.frame}`
                       ) : 
                       `malo_attack_${e.frame}`;
                       
        const img = this.assets.get(imgKey);
        if (img && this.assetsLoaded.has(imgKey)) {
            ctx.save();
            if (e.direction === -1) {
                ctx.translate(e.x * 2, 0);
                ctx.scale(-1, 1);
            }
            const tint = e.isTank ? 'rgba(120,0,180,0.4)' : e.isSprinter ? 'rgba(0,200,220,0.35)' : null;
            ctx.drawImage(img, e.x - size / 2, e.y - size / 2, size, size);
            if (tint) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = tint;
                ctx.fillRect(e.x - size / 2, e.y - size / 2, size, size);
                ctx.restore();
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(e.x, e.y, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = e.isTank ? '#7c3aed' : e.isSprinter ? '#06b6d4' : '#ef4444';
            ctx.fill();
        }

        // HP bar
        const barW = size + 4;
        const filled = Math.max(0, (e.hp / e.maxHp)) * barW;
        ctx.fillStyle = '#000000aa';
        ctx.fillRect(e.x - barW / 2 - 1, e.y - size / 2 - 9, barW + 2, 6);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x - barW / 2, e.y - size / 2 - 8, filled, 4);
    }

    // ─────────────── Public Economy API ───────────────────────────────

    public getPlayer(): Player { return this.player; }
    public getWave(): number { return this.wave; }
    public isWaveActive(): boolean { return this.waveActive; }

    /** Upgrade: +30% max HP and restore to full */
    public upgradeHp(): boolean {
        const cost = 20 + this.wave * 3;
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.player.maxHp = Math.floor(this.player.maxHp * 1.3);
        this.player.hp = this.player.maxHp;
        this.callbacks.onGoldChange(this.player.gold);
        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
        return true;
    }

    /** Upgrade: +20% damage */
    public upgradeDamage(): boolean {
        const cost = 15 + this.wave * 2;
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.player.dmgBoost *= 1.2;
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Upgrade: +15% speed */
    public upgradeSpeed(): boolean {
        const cost = 25 + this.wave * 3;
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.player.speedBoost = Math.min(2.5, this.player.speedBoost * 1.15);
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Consumable: full heal */
    public buyPotion(): boolean {
        const cost = 60;
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.player.hp = this.player.maxHp;
        this.callbacks.onGoldChange(this.player.gold);
        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
        return true;
    }

    /** Consumable: shield absorbs 50 damage */
    public buyShield(): boolean {
        const cost = 15;
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.player.shield += 50;
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Triggered by UI after wave-end overlay dismissed */
    public nextWave(): void {
        if (this.waveActive) return;
        this.startWave();
    }

    /** Get dynamic shop costs for display */
    public getShopCosts() {
        const w = this.wave;
        return {
            hp: 20 + w * 3,
            damage: 15 + w * 2,
            speed: 25 + w * 3,
            potion: 60,
            shield: 15
        };
    }
}

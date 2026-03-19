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
import buenoImgUrl from '../../assets/BuenoMelee/Sprites/IdleFront.png';
import arrowImgUrl from '../../assets/weapons/flecha.png';
import obsImgUrl from '../../assets/Obstacle/82cfbcc1-c0ad-4c07-91ae-ca682d039cb1_unnamed_1_-removebg-preview.png';
import bossImgUrl from '../../assets/bosses/BeholderFrame1.png';
import goldsacImgUrl from '../../assets/goldsac-removebg-preview.png';

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

const BUENO_MELEE_ASSETS = {
    idleFront: import.meta.glob('../../assets/BuenoMelee/Sprites/IdleFront.png', { eager: true, as: 'url' }),
    idleBack: import.meta.glob('../../assets/BuenoMelee/Sprites/IdleBack.png', { eager: true, as: 'url' }),
    idleLeft: import.meta.glob('../../assets/BuenoMelee/Sprites/IdleLeft.png', { eager: true, as: 'url' }),
    idleRight: import.meta.glob('../../assets/BuenoMelee/Sprites/IdleRight.png', { eager: true, as: 'url' }),
    runFront: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunFront1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunFront2.png', { eager: true, as: 'url' }),
    ],
    runBack: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack4.png', { eager: true, as: 'url' }),
    ],
    runLeft: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft4.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft5.png', { eager: true, as: 'url' }),
    ],
    runRight: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight4.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight5.png', { eager: true, as: 'url' }),
    ],
    attackLeft: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft4.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft5.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft6.png', { eager: true, as: 'url' }),
    ],
    attackRight: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight1.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight2.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight3.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight4.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight5.png', { eager: true, as: 'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight6.png', { eager: true, as: 'url' }),
    ],
};

const BOSS_RAY_ASSETS = import.meta.glob('../../assets/bosses/Ray*.png', { eager: true, as: 'url' });
const BOSS_FRAMES = import.meta.glob('../../assets/bosses/BeholderFrame*.png', { eager: true, as: 'url' });

// ─────────────────── Types ───────────────────
export type ClaseWave = 'guerrero' | 'arquero';

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
    skillRadius: number;
    color: string;
}

export const CLASES_STATS: Record<ClaseWave, ClaseStats> = {
    guerrero: {
        nombre: 'Guerrero', emoji: '⚔️',
        hp: 300, speed: 140, damage: 40, attackRange: 120, attackCooldown: 0.6,
        skill: 'Golpe Sísmico', skillCooldown: 10, skillRadius: 150, color: '#ef4444'
    },
    arquero: {
        nombre: 'Arquero', emoji: '🏹',
        hp: 120, speed: 200, damage: 20, attackRange: 300, attackCooldown: 0.4,
        skill: 'Lluvia de Flechas', skillCooldown: 8, skillRadius: 200, color: '#22c55e'
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
    // Status effects
    poisonTimer?: number;
    bleedTimer?: number;
    marked?: boolean;
    wanderTarget: { x: number, y: number } | null;
    wanderWaitTimer: number;
    moveMode: 'horizontal' | 'up' | 'down';
}

export interface Obstacle {
    x: number; y: number;
    radius: number;
}

export interface AoEEffect {
    x: number; y: number;
    radius: number;
    life: number;
    maxLife: number;
    color: string;
    type?: 'circle' | 'cone';
    startAngle?: number;
    endAngle?: number;
}

export type BuffType = 
    'penetration' | 'bigger_area' | 'life_steal' | 'multi_attack' | 
    'attack_speed' | 'defense' | 'critical' | 'bounce' | 
    'bleed' | 'execute' | 'backstab' | 'poison' | 'mark';

export interface BuffDef {
    type: BuffType;
    label: string;
    desc: string;
    icon: string;
    classRestrict?: ClaseWave;
}

export const ALL_BUFFS: BuffDef[] = [
    { type: 'penetration', label: 'Penetración', desc: 'Las flechas atraviesan enemigos.', icon: '🏹', classRestrict: 'arquero' },
    { type: 'bigger_area', label: 'Gran Impacto', desc: 'Aumenta el área de tus ataques.', icon: '💥', classRestrict: 'guerrero' },
    { type: 'life_steal', label: 'Robo de Vida', desc: 'Cura un % al golpear.', icon: '🧛', classRestrict: undefined },
    { type: 'multi_attack', label: 'Multidisparo', desc: 'Dispara flechas adicionales.', icon: '🏹🏹', classRestrict: 'arquero' },
    { type: 'attack_speed', label: 'Celeridad', desc: '+20% velocidad de ataque.', icon: '⚡', classRestrict: undefined },
    { type: 'defense', label: 'Fortaleza', desc: '-15% daño recibido.', icon: '🛡️', classRestrict: undefined },
    { type: 'critical', label: 'Crítico', desc: 'Probabilidad de doble daño.', icon: '🎯', classRestrict: undefined },
    { type: 'bounce', label: 'Rebote', desc: 'Las flechas rebotan.', icon: '↩️', classRestrict: 'arquero' },
    { type: 'bleed', label: 'Sangrado', desc: 'Daño por tiempo al golpear.', icon: '🩸', classRestrict: 'guerrero' },
    { type: 'execute', label: 'Ejecutor', desc: 'Más daño a enemigos heridos.', icon: '💀', classRestrict: 'guerrero' },
    { type: 'backstab', label: 'Puñalada', desc: 'Más daño por la espalda.', icon: '🗡️', classRestrict: 'guerrero' },
    { type: 'poison', label: 'Veneno', desc: 'Envenena a tus enemigos.', icon: '🧪', classRestrict: 'arquero' },
    { type: 'mark', label: 'Marca', desc: 'Los enemigos marcados reciben más daño.', icon: '🎯', classRestrict: 'arquero' }
];

export interface BossLaser {
    x: number; y: number;
    angle: number; width: number;
    life: number; maxLife: number;
    isWarning: boolean;
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
    speed?: number;
}

export interface DamageNumber {
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
    
    // Mastery
    mastery: Record<string, number>;
    essenceGained: number;
    revived: boolean;
    
    // XP / Leveling (internal to session)
    exp: number;
    level: number;
    goldMult: number;
    expMult: number;

    // Movement / Animation state
    isMouseDown: boolean;
    // Buffs active
    buffs: Set<BuffType>;
    stats: {
        critChance: number;
        lifeSteal: number;
        defense: number;
        penetration: boolean;
        multiShot: number;
        bounceCount: number;
        areaMult: number;
        bleed: boolean;
        poison: boolean;
        execute: boolean;
        backstab: boolean;
        mark: boolean;
    };
    // Animation
    state: 'idle' | 'run' | 'attack';
    direction: number; // -1 for left, 1 for right
    frame: number;
    frameTimer: number;
    moveMode: 'horizontal' | 'up' | 'down';
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
    onBossHpChange: (hp: number, max: number, visible: boolean) => void;
    onBuffDrop: (options: BuffDef[]) => void;
}

export class WaveGame {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private W!: number;
    private H!: number;

    // Assets
    private assets: Map<string, HTMLImageElement> = new Map();
    private assetsLoaded: Set<string> = new Set();
    private tintCanvas = document.createElement('canvas');
    private tintCtx = this.tintCanvas.getContext('2d', {willReadFrequently: true})!;

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
    private isSpawning: boolean = false;
    private readonly WAVE_INTERVAL = 20;
    private bossActive: boolean = false;
    private bossHp: number = 0;
    private bossMaxHp: number = 0;
    private bossX: number = 0;
    private bossY: number = 0;
    private bossState: 'idle' | 'charging' | 'firing' | 'moving' = 'idle';
    private bossTimer: number = 0;
    private bossBeamAngle: number = 0;
    private bossTargetX: number = 0;
    private bossTargetY: number = 0;
    private bossBulletHellTimer: number = 0;
    private bossShake: number = 0;
    private bossFrame: number = 0;
    private bossFrameTimer: number = 0;
    private screenshake: number = 0;
    private lasers: BossLaser[] = [];

    // Upgrades state
    private upgradesBought: Record<string, number> = {
        hp: 0, damage: 0, speed: 0, gold: 0, exp: 0
    };

    // Corner spawn zones (as fractions of W/H)
    private readonly SPAWN_MARGIN = 0.15;

    // Mouse tracking
    private mouseX: number;
    private mouseY: number;
    private keys: Record<string, boolean> = {};
    private keyDownHandler!: (e: KeyboardEvent) => void;
    private keyUpHandler!: (e: KeyboardEvent) => void;
    private mouseMoveHandler!: (e: MouseEvent) => void;
    private mouseDownHandler!: () => void;
    private mouseUpHandler!: () => void;

    // Removed duplicates

    // RAF
    private frameId: number = 0;
    private lastTime: number = 0;

    private callbacks: WaveCallbacks;

    constructor(canvas: HTMLCanvasElement, claseKey: ClaseWave, callbacks: WaveCallbacks, mastery?: Record<string, number>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.W = canvas.width;
        this.H = canvas.height;
        this.mouseX = this.W / 2;
        this.mouseY = this.H / 2;
        this.callbacks = callbacks;
        this.clase = CLASES_STATS[claseKey];

        this.loadAssets();
        this.initPlayer(mastery);

        this.keyDownHandler = (e: KeyboardEvent) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'e' || e.key === 'E') this.activateSkill();
            if (['arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) e.preventDefault();
        };
        this.keyUpHandler = (e: KeyboardEvent) => { this.keys[e.key.toLowerCase()] = false; };
        this.mouseMoveHandler = (e: MouseEvent) => this.updateMouse(e);
        this.mouseDownHandler = () => this.setMouseDown(true);
        this.mouseUpHandler = () => this.setMouseDown(false);

        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        window.addEventListener('mouseup', this.mouseUpHandler);
        window.addEventListener('blur', this.mouseUpHandler);
    }

    private updateMouse(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    private loadAssets(): void {
        const map: Record<string, string> = {
            bg: bgImgUrl, malo: maloImgUrl, malo2: malo2ImgUrl, bueno: buenoImgUrl, flecha: arrowImgUrl, obstaculo: obsImgUrl, boss: bossImgUrl, goldsac: goldsacImgUrl
        };
        for (const [k, src] of Object.entries(map)) {
            const img = new Image();
            img.src = src;
            img.onload = () => this.assetsLoaded.add(k);
            this.assets.set(k, img);
        }

        // Load Boss Ray animation
        const rayKeys = Object.keys(BOSS_RAY_ASSETS).sort();
        rayKeys.forEach((key, i) => {
            const img = new Image();
            img.src = (BOSS_RAY_ASSETS[key] as any);
            img.onload = () => this.assetsLoaded.add(`boss_ray_${i}`);
            this.assets.set(`boss_ray_${i}`, img);
        });
        
        // Load Boss Beholder animation
        const bossFrameKeys = Object.keys(BOSS_FRAMES).sort();
        bossFrameKeys.forEach((key, i) => {
            const img = new Image();
            img.src = (BOSS_FRAMES[key] as any);
            img.onload = () => this.assetsLoaded.add(`boss_frame_${i}`);
            this.assets.set(`boss_frame_${i}`, img);
        });

        // Load melee animations
        const meleeFrames = [
            { key: 'malo_idle', src: Object.values(MALO_MELEE_ASSETS.idleFront)[0] as string },
            ...MALO_MELEE_ASSETS.attack.map((f, i) => ({ key: `malo_attack_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runRight.map((f, i) => ({ key: `malo_run_side_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runBack.map((f, i) => ({ key: `malo_run_up_${i}`, src: Object.values(f)[0] as string })),
            ...MALO_MELEE_ASSETS.runFront.map((f, i) => ({ key: `malo_run_down_${i}`, src: Object.values(f)[0] as string })),
            // Player BuenoMelee frames
            { key: 'bueno_idle_front', src: Object.values(BUENO_MELEE_ASSETS.idleFront)[0] as string },
            { key: 'bueno_idle_back', src: Object.values(BUENO_MELEE_ASSETS.idleBack)[0] as string },
            { key: 'bueno_idle_left', src: Object.values(BUENO_MELEE_ASSETS.idleLeft)[0] as string },
            { key: 'bueno_idle_right', src: Object.values(BUENO_MELEE_ASSETS.idleRight)[0] as string },
            ...BUENO_MELEE_ASSETS.runFront.map((f, i) => ({ key: `bueno_run_down_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_MELEE_ASSETS.runBack.map((f, i) => ({ key: `bueno_run_up_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_MELEE_ASSETS.runLeft.map((f, i) => ({ key: `bueno_run_left_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_MELEE_ASSETS.runRight.map((f, i) => ({ key: `bueno_run_right_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_MELEE_ASSETS.attackLeft.map((f, i) => ({ key: `bueno_attack_left_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_MELEE_ASSETS.attackRight.map((f, i) => ({ key: `bueno_attack_right_${i}`, src: Object.values(f)[0] as string }))
        ];

        for (const frame of meleeFrames) {
            const img = new Image();
            img.src = frame.src;
            img.onload = () => this.assetsLoaded.add(frame.key);
            this.assets.set(frame.key, img);
        }
    }

    private initPlayer(mastery?: Record<string, number>): void {
        const c = this.clase;
        const m = mastery || { hp: 0, damage: 0, atkSpd: 0, movSpd: 0, reflex: 0, cooldown: 0, luck: 0, revive: 0 };
        
        // Apply mastery bonuses
        const hpBoost = 1 + (m.hp || 0) * 0.05;
        const dmgBoost = 1 + (m.damage || 0) * 0.05;
        const speedBoost = 1 + (m.movSpd || 0) * 0.05;
        const cdReduction = Math.max(0.3, 1 - (m.cooldown || 0) * 0.07);

        this.player = {
            x: this.W / 2, y: this.H / 2,
            hp: c.hp * hpBoost, maxHp: c.hp * hpBoost,
            speed: c.speed * speedBoost, 
            damage: c.damage * dmgBoost,
            attackRange: c.attackRange,
            attackCooldown: c.attackCooldown * (1 / (1 + (m.atkSpd || 0) * 0.1)),
            attackTimer: 0,
            skillCooldown: c.skillCooldown * cdReduction,
            skillTimer: 0,
            skillActive: false, skillActiveTimer: 0,
            kills: 0, gold: 100,
            dmgBoost: 1, speedBoost: 1,
            invincible: false, invincibleTimer: 0,
            shield: 0,
            mastery: m,
            essenceGained: 0,
            revived: false,
            goldMult: 1,
            expMult: 1,
            exp: 0,
            level: 1,
            isMouseDown: false,
            buffs: new Set(),
            stats: {
                critChance: (m.luck || 0) * 0.02,
                lifeSteal: 0,
                defense: 0,
                penetration: false,
                multiShot: 0,
                bounceCount: 0,
                areaMult: 1,
                bleed: false,
                poison: false,
                execute: false,
                backstab: false,
                mark: false
            },
            state: 'idle',
            direction: 1,
            frame: 0,
            frameTimer: 0,
            moveMode: 'horizontal'
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
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
        window.removeEventListener('mouseup', this.mouseUpHandler);
        window.addEventListener('blur', this.mouseUpHandler);
    }

    // ─────────────── Wave Management ───────────────────────────────

    private startWave(): void {
        this.wave++;
        this.waveTime = 0;
        this.waveActive = true;
        this.isSpawning = true;
        this.waveStartTimer = this.WAVE_INTERVAL; // Start timer for next wave
        
        // No clear enemies or projectiles - they persist across waves
        
        this.callbacks.onWaveChange(this.wave);
        this.callbacks.onStatusMsg(`OLEADA ${this.wave}`);
        this.spawnEnemiesForWave();
    }

    private spawnObstacles(): void {
        const count = 5 + Math.floor(this.wave / 2);
        for (let i = 0; i < count; i++) {
            let x, y, dist, radius;
            let attempts = 0;
            do {
                x = Math.random() * (this.W - 100) + 50;
                y = Math.random() * (this.H - 100) + 50;
                radius = 30 + Math.random() * 20;
                dist = Math.hypot(x - this.player.x, y - this.player.y);
                attempts++;
            } while ((dist < 150 || !this.isFarFromCorners(x, y, radius)) && attempts < 100);

            this.obstacles.push({ x, y, radius });
        }
    }

    private isFarFromCorners(x: number, y: number, radius: number): boolean {
        const m = 150;
        const corners = [
            {x: 0, y: 0}, {x: this.W, y: 0},
            {x: 0, y: this.H}, {x: this.W, y: this.H}
        ];
        for (const c of corners) {
            if (Math.hypot(x - c.x, y - c.y) < m + radius + 50) return false;
        }
        return true;
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

                const scale = Math.pow(1.15, this.wave - 1);
                const hp = isTank ? ((240 + this.wave * 25) * scale) : isSprinter ? ((30 + this.wave * 7) * scale) : ((75 + this.wave * 12) * scale);
                const speed = isTank ? 45 : isSprinter ? 130 : (70 + this.wave * 4);
                const damage = (isTank ? 35 : isSprinter ? 10 : 18) * scale;
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
                    detectionRadius: 350 + Math.random() * 50,
                    spottedPlayer: false,
                    wanderTarget: null,
                    wanderWaitTimer: Math.random() * 2,
                    moveMode: 'horizontal'
                });
                this.callbacks.onEnemiesChange(this.enemies.length);

                if (i === total - 1) {
                    this.isSpawning = false;
                }
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
            // Only count down if NOT a boss wave OR if waves are not active (shop mode)
            const isBossWave = (this.wave % 10 === 0 && this.wave > 0);
            
            if (!this.waveActive || !isBossWave) {
                this.waveStartTimer -= dt;
                if (this.waveStartTimer <= 0) {
                    this.startWave();
                }
            }
        }

        this.updatePlayer(dt);
        this.updateEnemies(dt);
        this.updateProjectiles(dt);
        this.updateDamageNumbers(dt);
        this.updateAoEEffects(dt);

        if (this.bossActive) {
            this.updateBoss(dt);
        } else if (this.waveActive && this.enemies.length === 0 && !this.isSpawning) {
            const isBossWave = (this.wave % 10 === 0 && this.wave > 0);
            if (isBossWave) {
                this.spawnBoss();
            } else {
                this.waveActive = false;
                this.callbacks.onWaveEnd(this.wave, this.player.gold);
                this.waveStartTimer = 999; // Effectively pause until manual "Next Wave"
            }
        }

        // Update screenshake and boss shake
        if (this.screenshake > 0) this.screenshake -= dt * 10;
        if (this.bossShake > 0) this.bossShake -= dt * 10;
        if (this.screenshake < 0) this.screenshake = 0;
        if (this.bossShake < 0) this.bossShake = 0;
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

        // Animation update
        p.frameTimer += dt;
        const fps = 10;
        
        const oldState = p.state;
        const oldMoveMode = p.moveMode;
        const oldDirection = p.direction;

        if (p.state !== 'attack') {
            p.state = (dx !== 0 || dy !== 0) ? 'run' : 'idle';
            if (p.state === 'run') {
                if (Math.abs(dy) > Math.abs(dx) * 1.5) {
                    p.moveMode = dy < 0 ? 'up' : 'down';
                } else {
                    p.moveMode = 'horizontal';
                    if (Math.abs(dx) > 0.1) p.direction = dx > 0 ? 1 : -1;
                }
            }
        }

        if (p.state !== oldState || p.moveMode !== oldMoveMode || p.direction !== oldDirection) {
            p.frame = 0; // Reset frame on state/direction/moveMode change
        }

        if (p.frameTimer > 1 / fps) {
            p.frameTimer = 0;
            if (p.state === 'run') {
                if (p.moveMode === 'up') p.frame = (p.frame + 1) % 4;
                else if (p.moveMode === 'down') p.frame = (p.frame + 1) % 2;
                else p.frame = (p.frame + 1) % 5;
            } else if (p.state === 'attack') {
                p.frame++;
                if (p.frame >= 6) {
                    p.state = 'idle';
                    p.frame = 0;
                }
            } else {
                p.frame = 0;
            }
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

        // Manual attack (hold click)
        p.attackTimer -= dt;
        if (p.isMouseDown && p.attackTimer <= 0) {
            p.attackTimer = p.attackCooldown;
            if (this.clase.nombre === 'Guerrero') {
                this.performWarriorAttack();
            } else if (this.clase.nombre === 'Arquero') {
                this.performArcherAttack();
            }
        }
    }

    private performWarriorAttack(): void {
        const p = this.player;
        p.state = 'attack';
        p.frame = 0;
        p.direction = (this.mouseX >= p.x) ? 1 : -1;
        const angle = Math.atan2(this.mouseY - p.y, this.mouseX - p.x);
        const coneWidth = Math.PI / 3; // 60 degrees
        
        for (const e of this.enemies) {
            const range = p.attackRange * p.stats.areaMult;
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (d <= range) {
                // Obstacle block check
                if (this.isObstacleBetween(p.x, p.y, e.x, e.y)) continue;

                const enemyAngle = Math.atan2(e.y - p.y, e.x - p.x);
                let diff = enemyAngle - angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;

                if (Math.abs(diff) < coneWidth / 2) {
                    let dmg = p.damage * p.dmgBoost;
                    if (Math.random() < p.stats.critChance) dmg *= 2;
                    dmg = Math.round(dmg * 10) / 10;
                    
                    // Execute
                    if (p.stats.execute && e.hp < (e.isTank ? 200 : 50)) dmg *= 1.5;
                    dmg = Math.round(dmg * 10) / 10;
                    // Backstab (enemy facing away from player)
                    if (p.stats.backstab) {
                        const playerToEnemy = Math.atan2(e.y - p.y, e.x - p.x);
                        let angleDiff = e.direction === 1 ? playerToEnemy - 0 : playerToEnemy - Math.PI;
                        while(angleDiff > Math.PI) angleDiff -= Math.PI*2;
                        while(angleDiff < -Math.PI) angleDiff += Math.PI*2;
                        if (Math.abs(angleDiff) > Math.PI / 2) dmg *= 1.4; // Hit from behind
                    }
                    dmg = Math.round(dmg * 10) / 10;

                    e.hp = Math.round((e.hp - dmg) * 10) / 10;
                    e.hitFlash = 0.2;
                    if (p.stats.bleed) e.bleedTimer = 3.0;
                    
                    this.spawnDamageNumber(e.x, e.y - 10, Math.round(dmg), '#ef4444');
                    
                    if (p.stats.lifeSteal > 0) {
                        p.hp = Math.min(p.maxHp, p.hp + dmg * p.stats.lifeSteal);
                        this.callbacks.onHpChange(p.hp, p.maxHp);
                    }
                }
            }
        }

        this.spawnAoE(p.x, p.y, p.attackRange, 0.25, 'rgba(239, 68, 68, 0.3)', 'cone', angle - coneWidth / 2, angle + coneWidth / 2);

        // Targeted attack on Boss
        if (this.bossActive) {
            const dist = Math.hypot(this.bossX - p.x, this.bossY - p.y);
            // Increased boss hitbox radius to 110 (fits 180x240 sprite)
            if (dist < p.attackRange + 110) {
                if (!this.isObstacleBetween(p.x, p.y, this.bossX, this.bossY)) {
                    const angleToBoss = Math.atan2(this.bossY - p.y, this.bossX - p.x);
                    let diff = angleToBoss - angle;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    if (Math.abs(diff) < coneWidth / 2) {
                        const dmg = p.damage * p.dmgBoost;
                        this.bossHp -= dmg;
                        this.bossShake = 2; // Trigger boss shake
                        this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
                        this.spawnDamageNumber(this.bossX, this.bossY - 30, Math.round(dmg), '#ef4444');
                        if (this.bossHp <= 0) this.onBossDeath();
                    }
                }
            }
        }

        this.cleanDeadEnemies();
    }

    private performArcherAttack(): void {
        const p = this.player;
        const baseAngle = Math.atan2(this.mouseY - p.y, this.mouseX - p.x);
        
        // Multi-shot logic
        const count = 1 + p.stats.multiShot;
        const spread = Math.PI / 12; // 15 degrees between arrows
        for (let i = 0; i < count; i++) {
            const angle = baseAngle + (i - (count - 1) / 2) * spread;
            const tx = p.x + Math.cos(angle) * 100;
            const ty = p.y + Math.sin(angle) * 100;
            this.fireProjectileAt(p.x, p.y, tx, ty, p.damage * p.dmgBoost, true, 'flecha');
        }
        // Removed AoE green circle as requested

        if (this.bossActive) {
            const dist = Math.hypot(this.bossX - p.x, this.bossY - p.y);
            // Increased boss hitbox radius to 110
            if (dist < p.attackRange + 110) {
                const angleToBoss = Math.atan2(this.bossY - p.y, this.bossX - p.x);
                this.projectiles.push({
                    x: p.x, y: p.y,
                    tx: this.bossX, ty: this.bossY,
                    vx: Math.cos(angleToBoss),
                    vy: Math.sin(angleToBoss),
                    damage: p.damage * p.dmgBoost,
                    fromPlayer: true,
                    radius: 12,
                    life: 2,
                    color: '#fff',
                    assetKey: 'flecha',
                    rotation: angleToBoss + Math.PI / 2,
                    scale: 1.8
                });
            }
        }
        this.cleanDeadEnemies();
    }

    public setMouseDown(val: boolean): void {
        this.player.isMouseDown = val;
    }

    public handleMouseClick(): void {
        // Obsoleted by continuous attack logic in updatePlayer
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
                this.spawnDamageNumber(e.x, e.y, Math.round(dmg), '#ef4444');
            }
        }
        
        // Visual for skill
        if (this.clase.nombre === 'Guerrero') {
            this.spawnAoE(p.x, p.y, range, 0.5, 'rgba(239, 68, 68, 0.35)');
        } else if (this.clase.nombre === 'Arquero') {
            // Archer skill: circular burst of arrows - NO immediate damage
            const arrowCount = 12;
            const skillRange = p.attackRange * 1.5; // Lower range for skill
            for (let i = 0; i < arrowCount; i++) {
                const angle = (i / arrowCount) * Math.PI * 2;
                const tx = p.x + Math.cos(angle) * skillRange;
                const ty = p.y + Math.sin(angle) * skillRange;
                this.fireProjectileAt(p.x, p.y, tx, ty, p.damage * p.dmgBoost * 2, true, 'flecha', 1.5);
            }
            // Quick yellow flash instead of lingering circle
            this.spawnAoE(p.x, p.y, skillRange, 0.2, 'rgba(254, 240, 138, 0.25)');
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

            // Update status effects
            if (e.poisonTimer && e.poisonTimer > 0) {
                e.poisonTimer -= dt;
                if (Math.floor(e.poisonTimer * 2) !== Math.floor((e.poisonTimer + dt) * 2)) {
                   e.hp = Math.round((e.hp - 5) * 10) / 10; // DOT
                   this.spawnDamageNumber(e.x, e.y - 20, 5, '#a855f7');
                }
            }
            if (e.bleedTimer && e.bleedTimer > 0) {
                e.bleedTimer -= dt;
                if (Math.floor(e.bleedTimer * 3) !== Math.floor((e.bleedTimer + dt) * 3)) {
                   e.hp = Math.round((e.hp - 8) * 10) / 10; // DOT
                   this.spawnDamageNumber(e.x, e.y - 20, 8, '#ef4444');
                }
            }
            
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
                    let moveX = (dxPl / dPl) * e.speed * dt;
                    let moveY = (dyPl / dPl) * e.speed * dt;

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
                    } else {
                        // Smart AI Movement: sample 16 directions and pick the best valid one
                        // We remove the "must be closer than current" restriction to avoid local minima
                        let bestX = e.x;
                        let bestY = e.y;
                        let minDist = Infinity;

                        for (let i = 0; i < 16; i++) {
                            const ang = (i / 16) * Math.PI * 2;
                            const tx = e.x + Math.cos(ang) * e.speed * dt;
                            const ty = e.y + Math.sin(ang) * e.speed * dt;

                            if (!this.checkObstacleCollision(tx, ty, 20)) {
                                const dist = Math.hypot(p.x - tx, p.y - ty);
                                if (dist < minDist) {
                                    minDist = dist;
                                    bestX = tx;
                                    bestY = ty;
                                }
                            }
                        }
                        
                        // Apply best move if one was found
                        if (bestX !== e.x || bestY !== e.y) {
                            const actualDx = bestX - e.x;
                            const actualDy = bestY - e.y;
                            if (Math.abs(actualDy) > Math.abs(actualDx) * 1.5) {
                                e.moveMode = actualDy < 0 ? 'up' : 'down';
                            } else {
                                e.moveMode = 'horizontal';
                                if (Math.abs(actualDx) > 0.1) e.direction = actualDx > 0 ? 1 : -1;
                            }
                            
                            e.x = bestX;
                            e.y = bestY;
                        }
                    }
                } else {
                    // Melee attack range
                    e.state = 'attack';
                    e.attackTimer -= dt;
                    if (e.attackTimer <= 0) {
                        e.attackTimer = e.attackCooldown;
                        if (!p.invincible && !p.skillActive) {
                            let dmg = e.damage;
                            dmg *= (1 - p.stats.defense);
                            if (p.shield > 0) {
                                const absorbed = Math.min(p.shield, dmg);
                                p.shield -= absorbed;
                                dmg -= absorbed;
                            }
                            dmg = Math.round(dmg * 10) / 10;
                            p.hp = Math.round((p.hp - Math.max(0, dmg)) * 10) / 10;
                            p.invincible = true;
                            p.invincibleTimer = 0.5 + (this.player.mastery.reflex || 0) * 0.2;
                            this.callbacks.onHpChange(p.hp, p.maxHp);
                            this.spawnDamageNumber(p.x - 20, p.y - 30, dmg, '#ef4444');

                            if (p.hp <= 0) {
                                this.handlePlayerDeath();
                                break;
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

    private isObstacleBetween(x1: number, y1: number, x2: number, y2: number): boolean {
        for (const obs of this.obstacles) {
            // Check distance from obstacle center to line segment (x1,y1)-(x2,y2)
            const dx = x2 - x1;
            const dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;
            if (lenSq === 0) continue;

            const t = Math.max(0, Math.min(1, ((obs.x - x1) * dx + (obs.y - y1) * dy) / lenSq));
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            const dist = Math.hypot(obs.x - projX, obs.y - projY);

            if (dist < obs.radius) return true;
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
        const DEFAULT_SPEED = 360;
        for (const proj of this.projectiles) {
            const spd = proj.speed ?? DEFAULT_SPEED;
            proj.x += proj.vx * spd * dt;
            proj.y += proj.vy * spd * dt;
            proj.life -= dt;

            // Projectiles from player block on obstacles
            if (proj.fromPlayer && this.checkObstacleCollision(proj.x, proj.y, proj.radius)) {
                proj.life = 0;
            }
        }

        const projToRemove = new Set<Projectile>();
        const enemiesToRemove = new Set<number>();

        // Check projectile -> enemy hits
        for (const proj of this.projectiles) {
            if (!proj.fromPlayer || proj.life <= 0) continue;
            for (const e of this.enemies) {
                if (enemiesToRemove.has(e.id)) continue;
                const d = Math.hypot(proj.x - e.x, proj.y - e.y);
                const eRadius = e.isTank ? 40 : 25;
                if (d < eRadius + proj.radius) {
                    let dmg = proj.damage;
                    if (Math.random() < this.player.stats.critChance) dmg *= 2;
                    if (e.marked) dmg *= 1.3;

                    e.hp -= dmg;
                    e.hitFlash = 0.2;
                    if (this.player.stats.poison) e.poisonTimer = 4.0;
                    if (this.player.stats.mark) e.marked = true;

                    this.spawnDamageNumber(e.x, e.y - 10, Math.round(dmg), '#ef4444');
                    
                    if (this.player.stats.lifeSteal > 0) {
                        this.player.hp = Math.round(Math.min(this.player.maxHp, this.player.hp + dmg * this.player.stats.lifeSteal) * 10) / 10;
                        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
                    }

                    if (!this.player.stats.penetration) projToRemove.add(proj);
                    if (e.hp <= 0) {
                        enemiesToRemove.add(e.id);
                        this.killEnemy(e);
                    }
                    break;
                }
            }
            // Check projectile -> Boss hit
            if (this.bossActive && !projToRemove.has(proj)) {
                const d = Math.hypot(proj.x - this.bossX, proj.y - this.bossY);
                if (d < 110 + proj.radius) {
                    this.bossHp -= proj.damage;
                    this.bossShake = 2;
                    this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
                    this.spawnDamageNumber(this.bossX, this.bossY - 30, Math.round(proj.damage), '#ef4444');
                    projToRemove.add(proj);
                    if (this.bossHp <= 0) this.onBossDeath();
                }
            }
        }

        // Check projectile -> player hits
        if (!this.player.invincible && !this.player.skillActive) {
            for (const proj of this.projectiles) {
                if (proj.fromPlayer || proj.life <= 0) continue;
                const d = Math.hypot(proj.x - this.player.x, proj.y - this.player.y);
                if (d < 15 + proj.radius) {
                    this.player.hp -= proj.damage;
                    this.player.invincible = true;
                    this.player.invincibleTimer = 0.5 + (this.player.mastery.reflex || 0) * 0.2;
                    this.screenshake = 1.0;
                    this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
                    projToRemove.add(proj);
                    if (this.player.hp <= 0) {
                        this.handlePlayerDeath();
                        break;
                    }
                }
            }
        }

        this.enemies = this.enemies.filter(e => !enemiesToRemove.has(e.id));
        this.projectiles = this.projectiles.filter(p => !projToRemove.has(p) && p.life > 0);
        this.callbacks.onEnemiesChange(this.enemies.length);
    }

    private killEnemy(e: Enemy): void {
        this.player.kills++;
        const baseGold = e.isTank ? 15 : e.isSprinter ? 8 : 5;
        const gold = Math.floor((baseGold + this.wave * 2) * this.player.goldMult);
        this.player.gold += gold;
        this.player.exp += (e.isTank ? 20 : 10) * this.player.expMult;
        
        // Essence Reward (Mastery integration)
        let essProb = 0.005 + (this.player.mastery.luck || 0) * 0.002;
        if (e.isTank) essProb *= 3;
        if (Math.random() < essProb) {
            const gain = 1 + (e.isTank ? 1 : 0);
            this.player.essenceGained += gain;
            this.spawnDamageNumber(e.x + 20, e.y - 40, gain, '#a855f7'); // Purple for essence
        }

        this.callbacks.onKillsChange(this.player.kills);
        this.callbacks.onGoldChange(this.player.gold);
        this.spawnDamageNumber(e.x, e.y - 30, gold, '#fde047');
        this.checkBuffDrop(e);
    }

    private handlePlayerDeath(): void {
        const p = this.player;
        if (p.mastery.revive > 0 && !p.revived) {
            p.revived = true;
            p.hp = p.maxHp * 0.5;
            p.invincible = true;
            p.invincibleTimer = 3.0;
            this.callbacks.onHpChange(p.hp, p.maxHp);
            this.callbacks.onStatusMsg("🕯️ RESURRECCIÓN UMBRÍA");
            this.spawnAoE(p.x, p.y, 120, 0.6, 'rgba(168, 85, 247, 0.4)');
            return;
        }

        this.running = false;
        this.draw();
        setTimeout(() => this.callbacks.onGameOver(p.kills, this.wave), 300);
    }

    private cleanDeadEnemies(): void {
        const before = this.enemies.length;
        this.enemies = this.enemies.filter(e => {
            if (e.hp <= 0) {
                this.killEnemy(e);
                return false;
            }
            return true;
        });
        if (this.enemies.length !== before) {
            this.callbacks.onEnemiesChange(this.enemies.length);
        }
    }

    private checkBuffDrop(e: Enemy | 'boss'): void {
        let chance = 0.002; // 0.2%
        if (e === 'boss') chance = 1.0;
        else if (e.isTank || e.isSprinter) chance = 0.005;

        if (Math.random() < chance) {
            this.running = false; // PAUSE GAME
            const pool = ALL_BUFFS.filter(b => !b.classRestrict || b.classRestrict === (this.clase.nombre.toLowerCase() === 'guerrero' ? 'guerrero' : 'arquero'));
            const shuffled = [...pool].sort(() => 0.5 - Math.random());
            const options = shuffled.slice(0, 3);
            this.callbacks.onBuffDrop(options);
        }
    }

    public applyBuff(type: BuffType): void {
        this.player.buffs.add(type);
        const s = this.player.stats;
        switch(type) {
            case 'penetration': s.penetration = true; break;
            case 'bigger_area': s.areaMult += 0.3; break;
            case 'life_steal': s.lifeSteal += 0.05; break;
            case 'multi_attack': s.multiShot += 1; break;
            case 'attack_speed': this.player.attackCooldown *= 0.8; break;
            case 'defense': s.defense += 0.15; break;
            case 'critical': s.critChance += 0.15; break;
            case 'bounce': s.bounceCount += 1; break;
            case 'bleed': s.bleed = true; break;
            case 'execute': s.execute = true; break;
            case 'backstab': s.backstab = true; break;
            case 'poison': s.poison = true; break;
            case 'mark': s.mark = true; break;
        }
        this.running = true; // RESUME
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

    private spawnDamageNumber(x: number, y: number, val: number, color: string = '#ef4444'): void {
        this.damageNums.push({ x, y, val, life: 0.9, color });
    }

    private spawnAoE(x: number, y: number, radius: number, life: number, color: string, type: 'circle' | 'cone' = 'circle', startAngle: number = 0, endAngle: number = Math.PI * 2): void {
        this.aoeEffects.push({ x, y, radius, life, maxLife: life, color, type, startAngle, endAngle });
    }

    // ─────────────── Drawing ───────────────────────────────

    private draw(): void {
        const ctx = this.ctx;
        const W = this.W, H = this.H;

        ctx.save();
        if (this.screenshake > 0) {
            const rx = (Math.random() - 0.5) * this.screenshake * 8;
            const ry = (Math.random() - 0.5) * this.screenshake * 8;
            ctx.translate(rx, ry);
        }

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

        this.drawBoss();

        // Projectiles
        for (const p of this.projectiles) {
            ctx.save();
            ctx.translate(p.x, p.y);
            if (p.rotation !== undefined) ctx.rotate(p.rotation);
            
            if (p.assetKey && this.assets.has(p.assetKey)) {
                const img = this.assets.get(p.assetKey)!;
                const sw = 48 * (p.scale || 1);
                const sh = 20 * (p.scale || 1);
                // Arrow sprite points left in the PNG, so we add Math.PI to make it point in vx/vy dir
                if (p.assetKey === 'flecha') ctx.rotate(Math.PI);
                ctx.drawImage(img, -sw/2, -sh/2, sw, sh);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                if (!p.fromPlayer) {
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = p.color;
                }
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.restore();
        }

        // AoE Effects
        for (const a of this.aoeEffects) {
            ctx.save();
            ctx.globalAlpha = (a.life / a.maxLife) * 0.6;
            ctx.beginPath();
            if (a.type === 'cone') {
                ctx.moveTo(a.x, a.y);
                ctx.arc(a.x, a.y, a.radius, a.startAngle!, a.endAngle!);
                ctx.closePath();
            } else {
                ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
            }
            ctx.fillStyle = a.color;
            ctx.fill();
            ctx.restore();
        }

        // Damage numbers
        for (const n of this.damageNums) {
            ctx.save();
            ctx.globalAlpha = n.life / 0.9;
            ctx.font = '12px "Press Start 2P", "MedievalSharp", cursive';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text Stroke (Black border)
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.strokeText(String(Math.round(n.val)), n.x, n.y);
            
            // Text Fill
            ctx.fillStyle = n.color;
            ctx.fillText(String(Math.round(n.val)), n.x, n.y);

            // Goldsac for gold numbers
            if (n.color === '#fbbf24' || n.color === '#fde047') {
                const sacImg = this.assets.get('goldsac');
                if (sacImg && this.assetsLoaded.has('goldsac')) {
                    const txtWidth = ctx.measureText(String(Math.round(n.val))).width;
                    ctx.drawImage(sacImg, n.x + txtWidth/2 + 2, n.y - 12, 16, 16);
                }
            }
            ctx.restore();
        }

        ctx.restore(); // End screenshake
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

            const imgKey = p.state === 'idle' ? (
                p.moveMode === 'up' ? 'bueno_idle_back' :
                p.moveMode === 'down' ? 'bueno_idle_front' :
                (p.direction === 1 ? 'bueno_idle_right' : 'bueno_idle_left')
            ) : p.state === 'run' ? (
                p.moveMode === 'up' ? `bueno_run_up_${p.frame}` :
                p.moveMode === 'down' ? `bueno_run_down_${p.frame}` :
                (p.direction === 1 ? `bueno_run_right_${p.frame}` : `bueno_run_left_${p.frame}`)
            ) : ( // attack
                p.direction === 1 ? `bueno_attack_right_${p.frame}` : `bueno_attack_left_${p.frame}`
            );

            const img = this.assets.get(imgKey);
            if (img && this.assetsLoaded.has(imgKey)) {
                ctx.drawImage(img, p.x - SIZE / 2, p.y - SIZE / 2, SIZE, SIZE);
            } else {
                // ROBUST FALLBACK: Try idle sprite first, then circle
                const fallbackKey = p.direction === 1 ? 'bueno_idle_right' : 'bueno_idle_left';
                const fallbackImg = this.assets.get(fallbackKey);
                if (fallbackImg && this.assetsLoaded.has(fallbackKey)) {
                    ctx.drawImage(fallbackImg, p.x - SIZE / 2, p.y - SIZE / 2, SIZE, SIZE);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, SIZE / 2, 0, Math.PI * 2);
                    ctx.fillStyle = this.clase.color;
                    ctx.fill();
                }
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

        // Faint glow aura
        if (e.isTank || e.isSprinter) {
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = e.isTank ? '#a855f7' : '#eab308'; // Purple for tanks, yellow/gold for sprinters
            ctx.beginPath();
            ctx.arc(e.x, e.y, size / 2.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.01)'; // Very faint fill to ensure shadow renders
            ctx.fill();
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
            let drawX = e.x - size / 2;
            let drawY = e.y - size / 2;
            ctx.save();
            if (e.direction === -1) {
                ctx.translate(e.x * 2, 0);
                ctx.scale(-1, 1);
            }
            const tint = e.isTank ? 'rgba(120,0,180,0.4)' : e.isSprinter ? 'rgba(0,200,220,0.35)' : null;
            
            if (e.hitFlash > 0 || tint) {
                this.tintCanvas.width = size;
                this.tintCanvas.height = size;
                this.tintCtx.clearRect(0,0,size,size);
                this.tintCtx.drawImage(img, 0, 0, size, size);
                this.tintCtx.globalCompositeOperation = 'source-atop';
                if (tint) {
                    this.tintCtx.fillStyle = tint;
                    this.tintCtx.fillRect(0,0,size,size);
                }
                if (e.hitFlash > 0) {
                    this.tintCtx.fillStyle = `rgba(255,0,0,${Math.min(1, Math.max(0, e.hitFlash*5)) * 0.6})`;
                    this.tintCtx.fillRect(0,0,size,size);
                }
                this.tintCtx.globalCompositeOperation = 'source-over';
                ctx.drawImage(this.tintCanvas, drawX, drawY);
            } else {
                ctx.drawImage(img, drawX, drawY, size, size);
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(e.x, e.y, size / 2.2, 0, Math.PI * 2);
            ctx.fillStyle = e.isTank ? '#7c3aed' : (e.isSprinter ? '#06b6d4' : '#ef4444');
            ctx.fill();
        }

        // Restore HP Bar
        const barW = size * 0.8;
        const barH = 6;
        const filled = Math.max(0, (e.hp / e.maxHp) * barW);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - barW / 2, e.y - size / 2 - 12, barW, barH);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x - barW / 2, e.y - size / 2 - 12, filled, barH);
    }

    // ─────────────── Public Economy API ───────────────────────────────

    public getPlayer(): Player { return this.player; }
    public getWave(): number { return this.wave; }
    public isWaveActive(): boolean { return this.waveActive; }

    private getUpgradeCost(type: string, base: number): number {
        const count = this.upgradesBought[type] || 0;
        return Math.floor(base * Math.pow(1.5, count));
    }

    /** Upgrade: +30% max HP and restore to full */
    public upgradeHp(): boolean {
        const cost = this.getUpgradeCost('hp', 20);
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.upgradesBought['hp']++;
        this.player.maxHp = Math.floor(this.player.maxHp * 1.3);
        this.player.hp = this.player.maxHp;
        this.callbacks.onGoldChange(this.player.gold);
        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
        return true;
    }

    /** Upgrade: +20% damage */
    public upgradeDamage(): boolean {
        const cost = this.getUpgradeCost('damage', 15);
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.upgradesBought['damage']++;
        this.player.dmgBoost *= 1.2;
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Upgrade: +15% speed */
    public upgradeSpeed(): boolean {
        const cost = this.getUpgradeCost('speed', 25);
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.upgradesBought['speed']++;
        this.player.speedBoost = Math.min(2.5, this.player.speedBoost * 1.15);
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Upgrade: +20% gold gain */
    public upgradeGoldGain(): boolean {
        const cost = this.getUpgradeCost('gold', 30);
        if (this.player.gold < cost) return false;
        this.player.gold -= cost;
        this.upgradesBought['gold']++;
        this.player.goldMult *= 1.2;
        this.callbacks.onGoldChange(this.player.gold);
        return true;
    }

    /** Upgrade: XP Gain removed */
    public upgradeExpGain(): boolean {
        return false;
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
        return {
            hp: this.getUpgradeCost('hp', 20),
            damage: this.getUpgradeCost('damage', 15),
            speed: this.getUpgradeCost('speed', 25),
            gold: this.getUpgradeCost('gold', 30),
            exp: this.getUpgradeCost('exp', 25),
            potion: 60,
            shield: 15
        };
    }

    private onBossDeath(): void {
        this.bossActive = false;
        this.waveActive = false;
        this.callbacks.onBossHpChange(0, 0, false);
        this.player.gold += 500;
        this.callbacks.onGoldChange(this.player.gold);
        this.callbacks.onStatusMsg("¡VICTORIA! EL ESPECTADOR HA SIDO DERROTADO");
        
        this.checkBuffDrop('boss'); // Guaranteed drop
        
        // Skip the shop overlay and auto-start next wave after a short delay
        this.waveStartTimer = 5.0; // Give some time for the victory message
    }

    private drawBoss() {
        if (!this.bossActive) return;

        const ctx = this.ctx;
        const frameKey = `boss_frame_${this.bossFrame}`;
        let renderObj: HTMLImageElement | null | undefined = this.assets.get(frameKey);
        if (!renderObj || !this.assetsLoaded.has(frameKey)) renderObj = this.assets.get('boss');

        // Fixed scaling as requested to prevent twitching
        let bx = this.bossX, by = this.bossY;
        // Charging effect
        if (this.bossState === 'charging') {
            const t = this.bossTimer;
            ctx.save(); ctx.translate(bx, by);
            for (let i = 0; i < 8; i++) {
                const angle = t * 10 + (i / 8) * Math.PI * 2;
                const r = (1.0 - t / 2) * 80 + 20;
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 2. Draw Plasma Beam
        if (this.bossState === 'firing') {
            ctx.save();
            ctx.translate(this.bossX, this.bossY);
            ctx.rotate(this.bossBeamAngle);
            
            const time = performance.now() / 1000;
            const flicker = Math.sin(time * 60) * 5 + Math.random() * 10;
            const baseWidth = 60 + flicker;
            
            // Ray Sprite Animation
            const imgKey = `boss_ray_${(Math.floor(this.bossFrame * 8 / 12)) % 8}`;
            const rayImg = this.assets.get(imgKey);
            if (rayImg && this.assetsLoaded.has(imgKey)) {
                const rayW = 2000;
                const rayH = baseWidth * 2.5;
                ctx.drawImage(rayImg, 0, -rayH/2, rayW, rayH);
            }

            // Outer glow
            const gradOuter = ctx.createLinearGradient(0, -baseWidth, 0, baseWidth);
            gradOuter.addColorStop(0, 'rgba(239, 68, 68, 0)');
            gradOuter.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
            gradOuter.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = gradOuter;
            ctx.fillRect(0, -baseWidth, 2000, baseWidth * 2);
            
            // Inner vibrant beam
            const innerWidth = baseWidth * 0.6;
            const gradInner = ctx.createLinearGradient(0, -innerWidth, 0, innerWidth);
            gradInner.addColorStop(0, 'rgba(244, 63, 94, 0)');
            gradInner.addColorStop(0.5, 'rgba(244, 63, 94, 0.8)');
            gradInner.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = gradInner;
            ctx.fillRect(0, -innerWidth, 2000, innerWidth * 2);

            // Hot Core
            const coreWidth = 8 + Math.sin(time * 40) * 4;
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
            ctx.fillRect(0, -coreWidth / 2, 2000, coreWidth);
            ctx.shadowBlur = 0;

            // Origin Glow (Boss Eye)
            const eyeGlow = 40 + Math.sin(time * 30) * 10;
            const radGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, eyeGlow);
            radGrad.addColorStop(0, '#fff');
            radGrad.addColorStop(0.4, '#ef4444');
            radGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(0, 0, eyeGlow, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // 3. Draw Beholder Sprite
        let drawX = bx, drawY = by;
        if (this.bossShake > 0) {
            drawX += (Math.random() - 0.5) * this.bossShake * 5;
            drawY += (Math.random() - 0.5) * this.bossShake * 5;
        }
        if (renderObj) {
            // Normalize rendering to prevent twitching
            // Target width ~180, maintain aspect ratio
            const targetW = 180;
            const aspect = renderObj.width / (renderObj.height || 1);
            const rw = targetW;
            const rh = targetW / aspect;
            ctx.drawImage(renderObj, drawX - rw / 2, drawY - rh / 2, rw, rh);
        } else {
            // Placeholder
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(drawX, drawY, 50, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Draw Boss Lasers
        for (const laser of this.lasers) {
            ctx.save();
            ctx.translate(laser.x, laser.y);
            ctx.rotate(laser.angle);

            const alpha = laser.isWarning ? (Math.sin(laser.life * 10) * 0.5 + 0.5) * 0.6 : 1.0;
            const color = laser.isWarning ? 'rgba(255, 255, 0, ' : 'rgba(255, 0, 0, ';
            const width = laser.isWarning ? laser.width * 0.5 : laser.width;

            // Outer glow
            const gradOuter = ctx.createLinearGradient(0, -width, 0, width);
            gradOuter.addColorStop(0, color + '0)');
            gradOuter.addColorStop(0.5, color + (alpha * 0.4) + ')');
            gradOuter.addColorStop(1, color + '0)');
            ctx.fillStyle = gradOuter;
            ctx.fillRect(0, -width, this.W * 1.5, width * 2);
            
            // Inner vibrant beam
            const innerWidth = width * 0.6;
            const gradInner = ctx.createLinearGradient(0, -innerWidth, 0, innerWidth);
            gradInner.addColorStop(0, color + '0)');
            gradInner.addColorStop(0.5, color + (alpha * 0.8) + ')');
            gradInner.addColorStop(1, color + '0)');
            ctx.fillStyle = gradInner;
            ctx.fillRect(0, -innerWidth, this.W * 1.5, innerWidth * 2);

            ctx.restore();
        }
    }

    private spawnBoss(): void {
        this.bossActive = true;
        this.bossMaxHp = 1500 + (this.wave / 10) * 1000;
        this.bossHp = this.bossMaxHp;
        this.bossX = this.W / 2;
        this.bossY = -100; // Come from top
        this.bossState = 'moving';
        this.bossTargetX = this.W / 2;
        this.bossTargetY = 150;
        this.bossTimer = 0;
        this.bossBulletHellTimer = 0;
        this.callbacks.onStatusMsg("¡EL ESPECTADOR DE SUCESOS HA APARECIDO!");
        this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
        
        // Pause wave auto-start
        this.waveStartTimer = 0;
    }

    private updateBoss(dt: number): void {
        if (!this.bossActive) return;

        this.bossTimer += dt;
        this.bossBulletHellTimer += dt;

        this.bossFrameTimer += dt;
        if (this.bossFrameTimer > 0.08) {
            this.bossFrameTimer = 0;
            this.bossFrame = (this.bossFrame + 1) % 12; // 12 frames for Beholder
        }

        // 1. Movement logic
        if (this.bossState === 'moving') {
            const dx = this.bossTargetX - this.bossX;
            const dy = this.bossTargetY - this.bossY;
            const dist = Math.hypot(dx, dy);
            if (dist > 5) {
                const spd = 100;
                this.bossX += (dx / dist) * spd * dt;
                this.bossY += (dy / dist) * spd * dt;
            } else {
                this.bossState = 'idle';
                this.bossTimer = 0;
            }
        }

        // 2. Attack logic (Phase switching)
        if (this.bossState === 'idle') {
            if (this.bossTimer > 2) {
                this.bossState = 'charging';
                this.bossTimer = 0;
            }
        } else if (this.bossState === 'charging') {
            if (this.bossTimer > 2) {
                this.bossState = 'firing';
                this.bossTimer = 0;
                this.screenshake = 2.0; // Big shake when starting to fire
                this.bossBeamAngle = Math.atan2(this.player.y - this.bossY, this.player.x - this.bossX);
            }
        } else if (this.bossState === 'firing') {
            if (this.bossTimer > 3.5) {
                this.bossState = 'moving';
                this.bossTimer = 0;
                // Move to a new random top position
                this.bossTargetX = 100 + Math.random() * (this.W - 200);
                this.bossTargetY = 100 + Math.random() * 150;
            } else {
                const targetAngle = Math.atan2(this.player.y - this.bossY, this.player.x - this.bossX);
                let diff = targetAngle - this.bossBeamAngle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                this.bossBeamAngle += diff * dt * 0.7; // Reduced turn speed for dodging
                this.screenshake = Math.max(this.screenshake, 0.4); // Continuous slight shake
                this.checkBeamCollision(dt);
            }
        }

        // 3. Bullet Hell patterns
        const bulletHellInterval = (this.bossHp < this.bossMaxHp * 0.3) ? 2.5 : 4;
        if (this.bossBulletHellTimer > bulletHellInterval) {
            this.bossBulletHellTimer = 0;
            this.spawnBossBulletPattern();
        }

        // 4. Update Boss Lasers
        for (const laser of this.lasers) {
            laser.life -= dt;
            if (laser.isWarning && laser.life <= laser.maxLife / 2) { // Halfway through warning, activate
                laser.isWarning = false;
                this.screenshake = 1.0; // Shake when lasers activate
            }
            if (!laser.isWarning) {
                this.checkLaserCollision(laser, dt);
            }
        }
        this.lasers = this.lasers.filter(l => l.life > 0);
    }

    private checkBeamCollision(dt: number): void {
        const p = this.player;
        if (p.invincible || p.skillActive) return;

        const dist = Math.hypot(p.x - this.bossX, p.y - this.bossY);
        const angleToPlayer = Math.atan2(p.y - this.bossY, p.x - this.bossX);
        let diff = angleToPlayer - this.bossBeamAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        if (dist > 30 && Math.abs(diff) < 0.15) {
            p.hp -= 150 * dt;
            this.screenshake = 1.5; // Trigger screenshake on player hit by beam
            this.callbacks.onHpChange(p.hp, p.maxHp);
            if (p.hp <= 0) {
                this.callbacks.onGameOver(p.kills, this.wave);
                this.running = false;
            }
        }
    }

    private checkLaserCollision(laser: BossLaser, dt: number): void {
        const p = this.player;
        if (p.invincible || p.skillActive) return;

        // Rotate player position relative to laser origin and angle
        const cos = Math.cos(-laser.angle);
        const sin = Math.sin(-laser.angle);
        const px_rel = (p.x - laser.x) * cos - (p.y - laser.y) * sin;
        const py_rel = (p.x - laser.x) * sin + (p.y - laser.y) * cos;

        // Check if player is within the laser's rectangle (simplified)
        const playerRadius = 15;
        if (px_rel > -playerRadius && px_rel < this.W * 1.5 && // Laser extends far
            py_rel > -laser.width / 2 - playerRadius && py_rel < laser.width / 2 + playerRadius) {
            
            p.hp -= 100 * dt; // Damage per second
            this.screenshake = 1.0;
            this.callbacks.onHpChange(p.hp, p.maxHp);
            if (p.hp <= 0) {
                this.callbacks.onGameOver(p.kills, this.wave);
                this.running = false;
            }
        }
    }

    private spawnBossBulletPattern(): void {
        const patterns = ['circle', 'spiral', 'scatter', 'lasers'];
        const p = patterns[Math.floor(Math.random() * patterns.length)];
        
        const isEnraged = this.bossHp < this.bossMaxHp * 0.3;
        const count = isEnraged ? 22 : 12; 
        const baseAngle = Math.random() * Math.PI * 2;
        
        if (p === 'circle') {
            for (let i = 0; i < count; i++) {
                const angle = baseAngle + (i / count) * Math.PI * 2;
                this.fireBossProjectile(angle, 180);
            }
        } else if (p === 'spiral') {
            for (let i = 0; i < count; i++) {
                const angle = baseAngle + (i / count) * Math.PI * 4;
                this.fireBossProjectile(angle, 220);
            }
        } else if (p === 'lasers') {
            const lCount = isEnraged ? 5 : 3;
            for (let i = 0; i < lCount; i++) {
                const angle = baseAngle + (i / lCount) * Math.PI * 2;
                this.lasers.push({
                    x: this.bossX, y: this.bossY,
                    angle: angle, width: 25,
                    life: 1.5, maxLife: 1.5, isWarning: true
                });
            }
        } else {
            // Scatter at player
            const angleToPlayer = Math.atan2(this.player.y - this.bossY, this.player.x - this.bossX);
            const scatterCount = isEnraged ? 14 : 7;
            for (let i = 0; i < scatterCount; i++) {
                const angle = angleToPlayer + (Math.random() - 0.5) * (isEnraged ? 2.5 : 1.5); 
                this.fireBossProjectile(angle, (isEnraged ? 300 : 250) + Math.random() * 100);
            }
        }
    }

    private fireBossProjectile(angle: number, speed: number): void {
        this.projectiles.push({
            x: this.bossX, y: this.bossY,
            tx: this.bossX + Math.cos(angle) * 100,
            ty: this.bossY + Math.sin(angle) * 100,
            vx: Math.cos(angle),
            vy: Math.sin(angle),
            damage: 25,
            fromPlayer: false,
            radius: 10,
            life: 6,
            color: '#a855f7', 
            speed: speed * 0.7,
            rotation: angle
        });
    }
}

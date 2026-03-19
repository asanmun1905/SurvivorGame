import type { ClaseWave, BossLaser, Obstacle, DamageNumber, AoEEffect } from './WaveGame';
import { CLASES_STATS } from './WaveGame';
import { Entidad } from '../entities/Entidad';
import { BossEntity } from '../entities/BossEntity';
import { Tank } from '../entities/Tank';
import { Sprinter } from '../entities/Sprinter';
import { Enemigo } from '../entities/Enemigo';
import { Obstaculo } from '../entities/Obstaculo';

// ── Sprite URL imports (same as WaveGame) ──
import bgImgUrl from '../../assets/Background/background.png';
import arrowImgUrl from '../../assets/weapons/flecha.png';
import bossImgUrl from '../../assets/bosses/BeholderFrame1.png';
import obsImgUrl from '../../assets/Obstacle/82cfbcc1-c0ad-4c07-91ae-ca682d039cb1_unnamed_1_-removebg-preview.png';
import goldsacImgUrl from '../../assets/goldsac-removebg-preview.png';

const MALO_FRAMES = {
    idle:    import.meta.glob('../../assets/MaloMelee/IdleFront-removebg-preview.png',  { eager:true, as:'url' }),
    attack:  [
        import.meta.glob('../../assets/MaloMelee/Ataque1-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque2-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque3-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/Ataque4-removebg-preview.png', { eager:true, as:'url' }),
    ],
    runSide: [
        import.meta.glob('../../assets/MaloMelee/RunRight1-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight2-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight3-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight4-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight5-removebg-preview.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunRight6-removebg-preview.png', { eager:true, as:'url' }),
    ],
    runUp:   [
        import.meta.glob('../../assets/MaloMelee/RunBack1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack4.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack5.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunBack6.png', { eager:true, as:'url' }),
    ],
    runDown: [
        import.meta.glob('../../assets/MaloMelee/RunFront1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/MaloMelee/RunFront4.png', { eager:true, as:'url' }),
    ],
};

const BUENO_FRAMES = {
    idleFront:  import.meta.glob('../../assets/BuenoMelee/Sprites/IdleFront.png', { eager:true, as:'url' }),
    idleBack:   import.meta.glob('../../assets/BuenoMelee/Sprites/IdleBack.png',  { eager:true, as:'url' }),
    idleLeft:   import.meta.glob('../../assets/BuenoMelee/Sprites/IdleLeft.png',  { eager:true, as:'url' }),
    idleRight:  import.meta.glob('../../assets/BuenoMelee/Sprites/IdleRight.png', { eager:true, as:'url' }),
    runFront:   [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunFront1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunFront2.png', { eager:true, as:'url' }),
    ],
    runBack:    [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunBack4.png', { eager:true, as:'url' }),
    ],
    runLeft: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft4.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunLeft5.png', { eager:true, as:'url' }),
    ],
    runRight: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight4.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/RunRight5.png', { eager:true, as:'url' }),
    ],
    attackLeft: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft4.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft5.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackLeft6.png', { eager:true, as:'url' }),
    ],
    attackRight: [
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight1.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight2.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight3.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight4.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight5.png', { eager:true, as:'url' }),
        import.meta.glob('../../assets/BuenoMelee/Sprites/AttackRight6.png', { eager:true, as:'url' }),
    ],
};

// Plasma ray frames
const RAY_FRAMES = [
    import.meta.glob('../../assets/bosses/Ray1.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray2.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray3.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray4.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray5.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray6.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray7.png', { eager:true, as:'url' }),
    import.meta.glob('../../assets/bosses/Ray8.png', { eager:true, as:'url' }),
];

const BOSS_FRAMES = import.meta.glob('../../assets/bosses/BeholderFrame*.png', { eager: true, as: 'url' });

export interface SandboxPlayerStats {
    clase: ClaseWave;
    hp: number; damage: number; speed: number; x: number; y: number;
}
export interface SandboxCallbacks {
    onHpChange: (hp: number, max: number) => void;
    onKillsChange: (k: number) => void;
    onEnemiesChange: (n: number) => void;
    onGameOver: (kills: number) => void;
    onSkillCooldown: (ready: boolean, pct: number) => void;
    onStatusMsg: (msg: string) => void;
    onBossHpChange: (hp: number, max: number, visible: boolean) => void;
}

interface SandboxEnemy {
    id: number; x: number; y: number;
    hp: number; maxHp: number; speed: number; damage: number; radius: number;
    type: 'normal'|'tank'|'sprinter';
    attackRange: number; attackCooldown: number; attackTimer: number; hitFlash: number;
    state: 'idle'|'run'|'attack'; direction: number; frame: number; frameTimer: number;
    moveMode: 'horizontal'|'up'|'down';
}

interface SandboxProjectile {
    x: number; y: number; vx: number; vy: number;
    damage: number; fromPlayer: boolean; radius: number; life: number;
    color: string; assetKey?: string; rotation?: number; scale?: number; speed?: number;
    tx?: number; ty?: number;
}

export class PlayableSandbox {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private W: number; private H: number;

    private assets: Map<string, HTMLImageElement> = new Map();
    private assetsLoaded: Set<string> = new Set();
    private tintCanvas = document.createElement('canvas');
    private tintCtx = this.tintCanvas.getContext('2d', {willReadFrequently: true})!;

    private mode: 'setup'|'play' = 'setup';
    private running = false;
    private cellSize = 60;

    // Setup state
    private entities: Entidad[] = [];
    private playerStartPoint = { x: -1, y: -1 };

    // Play state
    private player: any;
    private enemies: SandboxEnemy[] = [];
    private obstacles: Obstacle[] = [];
    private projectiles: SandboxProjectile[] = [];
    private damageNums: DamageNumber[] = [];
    private aoeEffects: AoEEffect[] = [];
    private kills = 0;
    private screenshake = 0;

    // Boss state (same machine as WaveGame)
    private bossActive = false;
    private bossHp = 0; private bossMaxHp = 0;
    private bossX = 0; private bossY = 0;
    private bossState: 'idle'|'charging'|'firing'|'moving' = 'idle';
    private bossTimer = 0;
    private bossBeamAngle = 0;
    private bossTargetX = 0; private bossTargetY = 0;
    private bossShake = 0; private bossBulletHellTimer: number = 0;
    private lasers: BossLaser[] = [];
    private bossFrame = 0; private bossFrameTimer = 0;

    private callbacks: SandboxCallbacks;
    private mouseX = 0; private mouseY = 0;
    private keys: Record<string,boolean> = {};
    private isMouseDown = false;
    private animFrameId = 0; private lastTime = 0;

    private keyDownHandler: (e: KeyboardEvent) => void;
    private keyUpHandler: (e: KeyboardEvent) => void;
    private mouseMoveHandler: (e: MouseEvent) => void;
    private mouseDownHandler: () => void;
    private mouseUpHandler: () => void;

    constructor(canvas: HTMLCanvasElement, callbacks: SandboxCallbacks, mastery?: Record<string, number>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.W = canvas.width; this.H = canvas.height;
        this.callbacks = callbacks;
        this.player = { mastery: mastery || {} }; // Temp for setup
        this.loadAssets();

        this.keyDownHandler = (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if ((e.key === 'e' || e.key === 'E') && this.mode === 'play') this.activateSkill();
        };
        this.keyUpHandler = (e) => { this.keys[e.key.toLowerCase()] = false; };
        this.mouseMoveHandler = (e) => {
            const r = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - r.left; this.mouseY = e.clientY - r.top;
        };
        this.mouseDownHandler = () => { this.isMouseDown = true; };
        this.mouseUpHandler = () => { this.isMouseDown = false; };

        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        window.addEventListener('mouseup', this.mouseUpHandler);
    }

    private loadAssets() {
        const simple: Record<string,string> = { bg: bgImgUrl, flecha: arrowImgUrl, boss: bossImgUrl, obstaculo: obsImgUrl, goldsac: goldsacImgUrl };
        for (const [k, src] of Object.entries(simple)) {
            const img = new Image(); img.src = src;
            img.onload = () => {
                this.assetsLoaded.add(k);
                if (k === 'bg' && this.mode === 'setup') this.drawSetup();
            };
            this.assets.set(k, img);
        }
        // Malo melee
        this.loadImg('malo_idle', Object.values(MALO_FRAMES.idle)[0] as string);
        MALO_FRAMES.attack.forEach((f,i) => this.loadImg(`malo_attack_${i}`, Object.values(f)[0] as string));
        MALO_FRAMES.runSide.forEach((f,i) => this.loadImg(`malo_run_side_${i}`, Object.values(f)[0] as string));
        MALO_FRAMES.runUp.forEach((f,i) => this.loadImg(`malo_run_up_${i}`, Object.values(f)[0] as string));
        MALO_FRAMES.runDown.forEach((f,i) => this.loadImg(`malo_run_down_${i}`, Object.values(f)[0] as string));
        // Bueno melee
        this.loadImg('bueno_idle_front', Object.values(BUENO_FRAMES.idleFront)[0] as string);
        this.loadImg('bueno_idle_back',  Object.values(BUENO_FRAMES.idleBack)[0]  as string);
        this.loadImg('bueno_idle_left',  Object.values(BUENO_FRAMES.idleLeft)[0]  as string);
        this.loadImg('bueno_idle_right', Object.values(BUENO_FRAMES.idleRight)[0] as string);
        BUENO_FRAMES.runFront.forEach((f,i) => this.loadImg(`bueno_run_down_${i}`, Object.values(f)[0] as string));
        BUENO_FRAMES.runBack.forEach((f,i)  => this.loadImg(`bueno_run_up_${i}`,   Object.values(f)[0] as string));
        BUENO_FRAMES.runLeft.forEach((f,i)  => this.loadImg(`bueno_run_left_${i}`, Object.values(f)[0] as string));
        BUENO_FRAMES.runRight.forEach((f,i) => this.loadImg(`bueno_run_right_${i}`,Object.values(f)[0] as string));
        BUENO_FRAMES.attackLeft.forEach((f,i) => this.loadImg(`bueno_attack_left_${i}`, Object.values(f)[0] as string));
        BUENO_FRAMES.attackRight.forEach((f,i) => this.loadImg(`bueno_attack_right_${i}`, Object.values(f)[0] as string));
        // Plasma ray frames
        RAY_FRAMES.forEach((f,i) => this.loadImg(`ray_${i}`, Object.values(f)[0] as string));
        // Boss frames
        const bossFrameKeys = Object.keys(BOSS_FRAMES).sort();
        bossFrameKeys.forEach((key, i) => {
            this.loadImg(`boss_frame_${i}`, BOSS_FRAMES[key] as any);
        });
    }

    private loadImg(key: string, src: string) {
        const img = new Image(); img.src = src;
        img.onload = () => this.assetsLoaded.add(key);
        this.assets.set(key, img);
    }

    // ─── Setup ───
    public setCellSize(size: number) { this.cellSize = size; }

    public addEntityGrid(type: string, gx: number, gy: number) {
        this.removeEntityGrid(gx, gy);
        if (type === 'PlayerStart') {
            this.playerStartPoint = { x: gx, y: gy };
        } else if (type === 'Boss') {
            this.entities.push(new BossEntity(gx, gy));
            this.callbacks.onBossHpChange(0, 0, false); // don't show bar yet
        } else if (type === 'Tank') {
            this.entities.push(new Tank(gx, gy));
        } else if (type === 'Sprinter') {
            this.entities.push(new Sprinter(gx, gy));
        } else if (type === 'Enemigo') {
            this.entities.push(new Enemigo(gx, gy));
        } else if (type === 'Obstaculo') {
            this.entities.push(new Obstaculo(gx, gy));
        }
        this.drawSetup();
    }

    public removeEntityGrid(gx: number, gy: number) {
        if (this.playerStartPoint.x === gx && this.playerStartPoint.y === gy)
            this.playerStartPoint = { x: -1, y: -1 };
        this.entities = this.entities.filter(e => e.getX() !== gx || e.getY() !== gy);
        this.drawSetup();
    }

    public drawSetup() {
        if (this.mode !== 'setup') return;
        const ctx = this.ctx;
        // Background
        const bg = this.assets.get('bg');
        if (bg && this.assetsLoaded.has('bg')) ctx.drawImage(bg, 0, 0, this.W, this.H);
        else { ctx.fillStyle = '#1e1b4b'; ctx.fillRect(0, 0, this.W, this.H); }

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
        for (let x = 0; x <= this.W; x += this.cellSize) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,this.H); ctx.stroke(); }
        for (let y = 0; y <= this.H; y += this.cellSize) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(this.W,y); ctx.stroke(); }

        // Entities
        const obsImg = this.assets.get('obstaculo');
        const bossImg = this.assets.get('boss');
        for (const e of this.entities) {
            const ex = e.getX() * this.cellSize, ey = e.getY() * this.cellSize, cs = this.cellSize;
            if (e instanceof BossEntity) {
                if (bossImg && this.assetsLoaded.has('boss')) {
                    ctx.drawImage(bossImg, ex - cs*0.18, ey, cs*1.35, cs);
                } else {
                    ctx.fillStyle = e.getColor(); ctx.fillRect(ex, ey, cs, cs);
                    ctx.fillStyle = '#000'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText('B', ex + cs/2, ey + cs/2 + 5);
                }
            } else if (e instanceof Obstaculo) {
                if (obsImg && this.assetsLoaded.has('obstaculo')) ctx.drawImage(obsImg, ex, ey, cs, cs);
                else { ctx.fillStyle = '#475569'; ctx.fillRect(ex, ey, cs, cs); }
            } else {
                const img = this.assets.get('malo_idle');
                if (img && this.assetsLoaded.has('malo_idle')) {
                    ctx.drawImage(img, ex, ey, cs, cs);
                    const isTank = e instanceof Tank;
                    const isSprinter = e instanceof Sprinter;
                    const tint = isTank ? 'rgba(120,0,180,0.4)' : isSprinter ? 'rgba(0,200,220,0.35)' : null;
                    if (tint) {
                        ctx.fillStyle = tint;
                        ctx.fillRect(ex, ey, cs, cs);
                    }
                } else {
                    ctx.fillStyle = e.getColor();
                    ctx.globalAlpha = 0.85;
                    ctx.fillRect(ex + 4, ey + 4, cs - 8, cs - 8);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
                    const label = e instanceof Tank ? 'T' : e instanceof Sprinter ? 'S' : 'E';
                    ctx.fillText(label, ex + cs/2, ey + cs/2 + 4);
                }
            }
        }
        // Player start
        if (this.playerStartPoint.x !== -1) {
            const px = this.playerStartPoint.x * this.cellSize;
            const py = this.playerStartPoint.y * this.cellSize;
            const cs = this.cellSize;
            const img = this.assets.get('bueno_idle_front');
            if (img && this.assetsLoaded.has('bueno_idle_front')) {
                ctx.drawImage(img, px, py, cs, cs);
            } else {
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath(); ctx.arc(px + cs/2, py + cs/2, cs*0.4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('P', px + cs/2, py + cs/2 + 4);
            }
        }
        ctx.textAlign = 'left';
    }

    // ─── Play Phase ───
    public startPlayPhase(stats: SandboxPlayerStats, mastery?: Record<string, number>) {
        this.mode = 'play';
        const m = mastery || this.player.mastery || { hp: 0, damage: 0, atkSpd: 0, movSpd: 0, reflex: 0, cooldown: 0, luck: 0, revive: 0 };
        const cs = CLASES_STATS[stats.clase];

        // Apply mastery bonuses
        const hpBoost = 1 + (m.hp || 0) * 0.05;
        const dmgBoost = 1 + (m.damage || 0) * 0.05;
        const speedBoost = 1 + (m.movSpd || 0) * 0.05;
        const cdReduction = Math.max(0.3, 1 - (m.cooldown || 0) * 0.07);

        this.player = {
            ...stats, 
            maxHp: stats.hp * hpBoost,
            hp: stats.hp * hpBoost,
            damage: stats.damage * dmgBoost,
            speed: stats.speed * speedBoost,
            attackRange: cs.attackRange, 
            attackCooldown: cs.attackCooldown * (1 / (1 + (m.atkSpd || 0) * 0.1)), 
            attackTimer: 0,
            skillCooldown: cs.skillCooldown * cdReduction, 
            skillTimer: 0, 
            skillActive: false, 
            skillActiveTimer: 0,
            invincible: false, 
            invincibleTimer: 0,
            state: 'idle', direction: 1, frame: 0, frameTimer: 0, moveMode: 'horizontal',
            clase: stats.clase,
            mastery: m,
            revived: false,
            essenceGained: 0
        };

        if (this.playerStartPoint.x !== -1) {
            this.player.x = this.playerStartPoint.x * this.cellSize + this.cellSize/2;
            this.player.y = this.playerStartPoint.y * this.cellSize + this.cellSize/2;
        }

        this.enemies = []; this.obstacles = [];
        this.bossActive = false;

        for (const e of this.entities) {
            const px = e.getX() * this.cellSize + this.cellSize/2;
            const py = e.getY() * this.cellSize + this.cellSize/2;
            if (e instanceof BossEntity) {
                this.bossActive = true;
                this.bossMaxHp = e.getVitalidad();
                this.bossHp = this.bossMaxHp;
                this.bossX = px; this.bossY = py;
                this.bossState = 'idle'; this.bossTimer = 0;
                this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
            } else if (e instanceof Obstaculo) {
                this.obstacles.push({ x: px, y: py, radius: this.cellSize * 0.4 });
            } else {
                let type: 'normal'|'tank'|'sprinter' = 'normal';
                let hp = 100, speed = 90, dmg = 15, radius = 35;
                if (e instanceof Tank) { type = 'tank'; hp = 400; speed = 50; dmg = 30; radius = 45; }
                if (e instanceof Sprinter) { type = 'sprinter'; hp = 60; speed = 160; dmg = 10; radius = 25; }
                this.enemies.push({
                    id: Math.random(), x: px, y: py, hp, maxHp: hp, speed, damage: dmg, radius, type,
                    attackRange: radius + 15, attackCooldown: 1.2, attackTimer: 0, hitFlash: 0,
                    state: 'idle', direction: 1, frame: 0, frameTimer: 0,
                    detectionRadius: 1000, spottedPlayer: true,
                    wanderTarget: null, wanderWaitTimer: 0, moveMode: 'horizontal'
                } as any);
            }
        }

        this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
        this.callbacks.onEnemiesChange(this.enemies.length + (this.bossActive ? 1 : 0));

        this.running = true;
        this.lastTime = performance.now();
        this.animFrameId = requestAnimationFrame(t => this.loop(t));
    }

    private activateSkill() {
        if (!this.running || this.mode !== 'play') return;
        if (this.player.skillTimer > 0 || this.player.skillActive) return;
        this.player.skillActive = true;
        this.player.skillActiveTimer = this.player.clase === 'guerrero' ? 0.4 : 0.2;
        this.player.skillTimer = this.player.skillCooldown;
        this.player.invincible = true;
        this.player.invincibleTimer = this.player.skillActiveTimer;
        const cs = CLASES_STATS[this.player.clase as ClaseWave];
        this.aoeEffects.push({
            x: this.player.x, y: this.player.y,
            radius: cs.skillRadius || 150,
            life: this.player.skillActiveTimer, maxLife: this.player.skillActiveTimer,
            color: this.player.clase === 'guerrero' ? 'rgba(234,179,8,0.4)' : 'rgba(168,85,247,0.4)'
        });
    }

    private loop(time: number) {
        if (!this.running) return;
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;
        this.update(dt); this.draw();
        if (this.running) this.animFrameId = requestAnimationFrame(t => this.loop(t));
    }

    private update(dt: number) {
        if (this.screenshake > 0) { this.screenshake = Math.max(0, this.screenshake - dt * 5); }

        // Player movement
        let vx = 0, vy = 0;
        if (this.keys['w'] || this.keys['arrowup']) vy -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) vy += 1;
        if (this.keys['a'] || this.keys['arrowleft']) vx -= 1;
        if (this.keys['d'] || this.keys['arrowright']) vx += 1;
        if (vx !== 0 || vy !== 0) {
            const len = Math.hypot(vx, vy);
            const moveX = (vx/len) * this.player.speed * dt;
            const moveY = (vy/len) * this.player.speed * dt;
            
            if (!this.checkObstacleCollision(this.player.x + moveX, this.player.y + moveY, 20)) {
                this.player.x += moveX;
                this.player.y += moveY;
            }

            if (this.player.state !== 'attack') {
                this.player.state = 'run';
                if (vx !== 0) { this.player.direction = vx > 0 ? 1 : -1; this.player.moveMode = 'horizontal'; }
                else { this.player.moveMode = vy < 0 ? 'up' : 'down'; }
            }
        } else if (this.player.state !== 'attack') {
            if (this.player.state !== 'idle') this.player.frame = 0;
            this.player.state = 'idle';
        }
        
        const oldState = this.player.state;
        const oldMode = this.player.moveMode;
        const oldDir = this.player.direction;
        this.player.x = Math.max(20, Math.min(this.W-20, this.player.x));
        this.player.y = Math.max(20, Math.min(this.H-20, this.player.y));

        // Player animation frame
        this.player.frameTimer += dt;
        if (this.player.state === 'run' && this.player.frameTimer > 0.1) {
            this.player.frameTimer = 0;
            const maxFrames = this.player.moveMode === 'horizontal' ? 5 : this.player.moveMode === 'up' ? 4 : 2;
            this.player.frame = (this.player.frame + 1) % maxFrames;
        } else if (this.player.state === 'attack' && this.player.frameTimer > 0.06) {
            this.player.frameTimer = 0;
            this.player.frame++;
            if (this.player.frame >= 6) {
                this.player.state = 'idle';
                this.player.frame = 0;
            }
        }
        if (this.player.state !== oldState || this.player.moveMode !== oldMode || this.player.direction !== oldDir) {
            this.player.frame = 0;
        }

        if (this.player.state === 'idle') {
            this.player.frame = 0;
        }

        // Skill timers
        if (this.player.skillTimer > 0) {
            this.player.skillTimer -= dt;
            this.callbacks.onSkillCooldown(this.player.skillTimer <= 0, 1 - this.player.skillTimer / this.player.skillCooldown);
        }
        if (this.player.skillActiveTimer > 0) {
            this.player.skillActiveTimer -= dt;
            if (this.player.skillActiveTimer <= 0) { this.player.skillActive = false; this.player.invincible = false; }
        }
        if (this.player.invincibleTimer > 0) this.player.invincibleTimer -= dt;
        if (this.player.attackTimer > 0) this.player.attackTimer -= dt;

        // Auto-attack
        if (this.isMouseDown && this.player.attackTimer <= 0) {
            this.player.attackTimer = this.player.attackCooldown;
            this.player.state = 'attack'; this.player.frame = 0;
            this.player.direction = (this.mouseX >= this.player.x) ? 1 : -1;
            
            const dx = this.mouseX - this.player.x, dy = this.mouseY - this.player.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (this.player.clase === 'arquero') {
                this.projectiles.push({
                    x: this.player.x, y: this.player.y, vx: dx/dist, vy: dy/dist,
                    damage: this.player.damage, fromPlayer: true, radius: 12, life: 1.5,
                    color: '#3b82f6', assetKey: 'flecha', rotation: Math.atan2(dy,dx), scale: 1, speed: 500
                });
            } else {
                const angle = Math.atan2(dy, dx);
                const coneWidth = Math.PI / 3; // 60 degrees

                this.aoeEffects.push({
                    x: this.player.x, y: this.player.y,
                    radius: this.player.attackRange, life: 0.25, maxLife: 0.25, color: 'rgba(239,68,68,0.3)',
                    type: 'cone', startAngle: angle - coneWidth / 2, endAngle: angle + coneWidth / 2
                } as any);

                // Melee: damage enemies in CONE
                for (const e of this.enemies) {
                    const eDist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
                    if (eDist <= this.player.attackRange) {
                        const enemyAngle = Math.atan2(e.y - this.player.y, e.x - this.player.x);
                        let diff = enemyAngle - angle;
                        while(diff > Math.PI) diff -= Math.PI*2;
                        while(diff < -Math.PI) diff += Math.PI*2;
                        
                        if (Math.abs(diff) < coneWidth / 2) {
                            e.hp -= this.player.damage; e.hitFlash = 0.2;
                            this.addDamageNumber(e.x, e.y, this.player.damage, '#ef4444');
                        }
                    }
                }

                // Boss damage
                if (this.bossActive) {
                    const bDist = Math.hypot(this.bossX - this.player.x, this.bossY - this.player.y);
                    if (bDist <= this.player.attackRange + 50) {
                        const bossAngle = Math.atan2(this.bossY - this.player.y, this.bossX - this.player.x);
                        let diff = bossAngle - angle;
                        while(diff > Math.PI) diff -= Math.PI*2;
                        while(diff < -Math.PI) diff += Math.PI*2;

                        if (Math.abs(diff) < coneWidth / 2) {
                            this.bossHp -= this.player.damage;
                            this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
                            this.bossShake = 2;
                            this.addDamageNumber(this.bossX, this.bossY - 30, this.player.damage, '#ef4444');
                            if (this.bossHp <= 0) this.killBoss();
                        }
                    }
                }
            }
        }

        // Boss update (same state machine as WaveGame)
        this.updateBoss(dt);

        // Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx * (p.speed || 360) * dt;
            p.y += p.vy * (p.speed || 360) * dt;
            p.life -= dt;
            if (p.life <= 0) { this.projectiles.splice(i,1); continue; }

            if (p.fromPlayer) {
                let hit = false;
                if (this.bossActive && Math.hypot(p.x-this.bossX, p.y-this.bossY) < p.radius+80) {
                    this.bossHp -= p.damage;
                    this.bossShake = 1;
                    this.callbacks.onBossHpChange(this.bossHp, this.bossMaxHp, true);
                    this.addDamageNumber(this.bossX, this.bossY, p.damage, '#ef4444');
                    this.projectiles.splice(i,1); hit = true;
                    if (this.bossHp <= 0) this.killBoss();
                }
                if (!hit) for (let j = this.enemies.length-1; j>=0; j--) {
                    const e = this.enemies[j];
                    if (Math.hypot(p.x-e.x, p.y-e.y) < p.radius+e.radius) {
                    e.hp -= p.damage; e.hitFlash = 0.15;
                    this.addDamageNumber(e.x, e.y, p.damage, '#ef4444');
                    this.projectiles.splice(i,1); break;
                    }
                }
            } else if (!this.player.invincible && !this.player.skillActive) {
                if (Math.hypot(p.x-this.player.x, p.y-this.player.y) < p.radius+15) {
                    this.player.hp -= p.damage;
                    this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
                    this.screenshake = 0.5;
                    this.projectiles.splice(i,1);
                    if (this.player.hp <= 0) {
                        this.handlePlayerDeath();
                    }
                }
            }
        }

        // Enemies update
        for (let i = this.enemies.length-1; i>=0; i--) {
            const e = this.enemies[i];
            if (e.hp <= 0) {
                this.kills++;
                this.callbacks.onKillsChange(this.kills);
                this.enemies.splice(i,1);
                this.callbacks.onEnemiesChange(this.enemies.length + (this.bossActive ? 1 : 0));
                continue;
            }
            if (e.hitFlash > 0) e.hitFlash -= dt;
            if (e.attackTimer > 0) e.attackTimer -= dt;
            const dist = Math.hypot(this.player.x-e.x, this.player.y-e.y);
            if (dist > e.radius+15) {
                const moveX = ((this.player.x-e.x)/dist)*e.speed*dt;
                const moveY = ((this.player.y-e.y)/dist)*e.speed*dt;
                
                if (!this.checkObstacleCollision(e.x + moveX, e.y + moveY, e.radius)) {
                    e.x += moveX;
                    e.y += moveY;
                }

                e.state = 'run';
                const ex = this.player.x-e.x, ey2 = this.player.y-e.y;
                if (Math.abs(ex) >= Math.abs(ey2)) { e.moveMode = 'horizontal'; e.direction = ex > 0 ? 1 : -1; }
                else e.moveMode = ey2 < 0 ? 'up' : 'down';
                e.frameTimer += dt;
                if (e.frameTimer > 0.12) {
                    e.frameTimer = 0;
                    const maxF = e.moveMode === 'horizontal' ? 6 : e.moveMode === 'up' ? 6 : 4;
                    e.frame = (e.frame + 1) % maxF;
                }
            } else {
                e.state = 'attack';
                e.frameTimer += dt;
                if (e.frameTimer > 0.15) { e.frameTimer = 0; e.frame = (e.frame + 1) % 4; }
                if (e.attackTimer <= 0 && !this.player.invincible && !this.player.skillActive) {
                    e.attackTimer = e.attackCooldown;
                    this.player.hp -= e.damage;
                    this.addDamageNumber(this.player.x, this.player.y, e.damage, '#ef4444');
                    this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
                    this.screenshake = 0.5;
                    if (this.player.hp <= 0) {
                        this.handlePlayerDeath();
                    }
                }
            }
        }

        for (let i = this.aoeEffects.length-1; i>=0; i--) {
            this.aoeEffects[i].life -= dt;
            if (this.aoeEffects[i].life <= 0) this.aoeEffects.splice(i,1);
        }
        for (let i = this.damageNums.length-1; i>=0; i--) {
            this.damageNums[i].life -= dt; this.damageNums[i].y -= 30*dt;
            if (this.damageNums[i].life <= 0) this.damageNums.splice(i,1);
        }
    }

    private updateBoss(dt: number) {
        if (!this.bossActive || this.bossHp <= 0) return;
        this.bossTimer += dt; this.bossBulletHellTimer += dt;
        this.bossFrameTimer += dt;
        if (this.bossFrameTimer > 0.08) {
            this.bossFrameTimer = 0;
            this.bossFrame = (this.bossFrame + 1) % 12;
        }

        if (this.bossState === 'moving') {
            const dx = this.bossTargetX-this.bossX, dy = this.bossTargetY-this.bossY, d = Math.hypot(dx,dy);
            if (d > 5) { this.bossX += (dx/d)*100*dt; this.bossY += (dy/d)*100*dt; }
            else { this.bossState = 'idle'; this.bossTimer = 0; }
        } else if (this.bossState === 'idle') {
            if (this.bossTimer > 2) { this.bossState = 'charging'; this.bossTimer = 0; }
        } else if (this.bossState === 'charging') {
            if (this.bossTimer > 2) {
                this.bossState = 'firing'; this.bossTimer = 0;
                this.screenshake = 2;
                this.bossBeamAngle = Math.atan2(this.player.y-this.bossY, this.player.x-this.bossX);
            }
        } else if (this.bossState === 'firing') {
            if (this.bossTimer > 3) {
                this.bossState = 'moving'; this.bossTimer = 0;
                this.bossTargetX = 100 + Math.random()*(this.W-200);
                this.bossTargetY = 100 + Math.random()*150;
            } else {
                const target = Math.atan2(this.player.y-this.bossY, this.player.x-this.bossX);
                let diff = target - this.bossBeamAngle;
                while (diff > Math.PI) diff -= Math.PI*2;
                while (diff < -Math.PI) diff += Math.PI*2;
                this.bossBeamAngle += diff * dt * 0.7; // Slower turn speed
                this.checkBeamCollision(dt);
            }
        }
        
        // Update Lasers
        for (const laser of this.lasers) {
            laser.life -= dt;
            if (laser.isWarning && laser.life <= laser.maxLife / 2) {
                laser.isWarning = false;
                this.screenshake = 1.0;
            }
            if (!laser.isWarning) {
                this.checkLaserCollision(laser, dt);
            }
        }
        this.lasers = this.lasers.filter(l => l.life > 0);

        const bhInterval = (this.bossHp < this.bossMaxHp * 0.3) ? 2.5 : 4;
        if (this.bossBulletHellTimer > bhInterval) {
            this.bossBulletHellTimer = 0;
            this.spawnBossBulletPattern();
        }
    }
    
    private checkLaserCollision(laser: BossLaser, dt: number) {
        const p = this.player;
        if (p.invincible || p.skillActive) return;
        const cos = Math.cos(-laser.angle), sin = Math.sin(-laser.angle);
        const px_rel = (p.x - laser.x) * cos - (p.y - laser.y) * sin;
        const py_rel = (p.x - laser.x) * sin + (p.y - laser.y) * cos;
        const playerRadius = 15;
        if (px_rel > -playerRadius && px_rel < 2000 && 
            py_rel > -laser.width/2 - playerRadius && py_rel < laser.width/2 + playerRadius) {
            p.hp -= 100 * dt;
            this.screenshake = 1.0;
            this.callbacks.onHpChange(p.hp, p.maxHp);
            if (p.hp <= 0) this.handlePlayerDeath();
        }
    }

    private checkObstacleCollision(x: number, y: number, radius: number): boolean {
        for (const obs of this.obstacles) {
            if (Math.hypot(x - obs.x, y - obs.y) < radius + obs.radius) return true;
        }
        return false;
    }

    private checkBeamCollision(dt: number) {
        const p = this.player;
        if (p.invincible || p.skillActive) return;
        const dist = Math.hypot(p.x-this.bossX, p.y-this.bossY);
        const angleToPlayer = Math.atan2(p.y-this.bossY, p.x-this.bossX);
        let diff = angleToPlayer - this.bossBeamAngle;
        while (diff > Math.PI) diff -= Math.PI*2;
        while (diff < -Math.PI) diff += Math.PI*2;
        if (dist > 30 && Math.abs(diff) < 0.15) {
            p.hp -= 150*dt;
            this.screenshake = 1.5;
            this.callbacks.onHpChange(p.hp, p.maxHp);
            if (p.hp <= 0) this.handlePlayerDeath();
        }
    }

    private spawnBossBulletPattern() {
        const patterns = ['circle','spiral','scatter','lasers'];
        const pat = patterns[Math.floor(Math.random()*4)];
        const enraged = this.bossHp < this.bossMaxHp * 0.3;
        const count = enraged ? 22 : 12;
        const base = Math.random()*Math.PI*2;
        if (pat === 'circle') for (let i=0;i<count;i++) this.fireBossProj(base+(i/count)*Math.PI*2, 180);
        else if (pat === 'spiral') for (let i=0;i<count;i++) this.fireBossProj(base+(i/count)*Math.PI*4, 220);
        else if (pat === 'lasers') {
            const lCount = enraged ? 5 : 3;
            for (let i = 0; i < lCount; i++) {
                const angle = base + (i / lCount) * Math.PI * 2;
                this.lasers.push({
                    x: this.bossX, y: this.bossY,
                    angle: angle, width: 25,
                    life: 1.5, maxLife: 1.5, isWarning: true
                });
            }
        } else {
            const ang = Math.atan2(this.player.y-this.bossY, this.player.x-this.bossX);
            const sc = enraged ? 14 : 7;
            for (let i=0;i<sc;i++) this.fireBossProj(ang+(Math.random()-0.5)*(enraged?2.5:1.5), (enraged?300:250)+Math.random()*100);
        }
    }

    private fireBossProj(angle: number, speed: number) {
        this.projectiles.push({
            x: this.bossX, y: this.bossY, vx: Math.cos(angle), vy: Math.sin(angle),
            damage: 25, fromPlayer: false, radius: 10, life: 6, color: '#a855f7', rotation: angle, speed: speed*0.7
        });
    }

    private killBoss() {
        this.bossActive = false;
        this.kills++;
        this.callbacks.onKillsChange(this.kills);
        this.callbacks.onBossHpChange(0, 0, false);
        this.callbacks.onEnemiesChange(this.enemies.length);
    }

    private addDamageNumber(x: number, y: number, val: number, color: string) {
        this.damageNums.push({ x: x+(Math.random()-0.5)*40, y: y-20, val: Math.floor(val), life: 0.8, color });
    }

    private handlePlayerDeath() {
        const p = this.player;
        if (p.mastery.revive > 0 && !p.revived) {
            p.revived = true;
            p.hp = p.maxHp * 0.5;
            p.invincible = true;
            p.invincibleTimer = 3.0;
            this.callbacks.onHpChange(p.hp, p.maxHp);
            this.callbacks.onStatusMsg("🕯️ RESURRECCIÓN UMBRÍA");
            this.aoeEffects.push({
                x: p.x, y: p.y, radius: 120, life: 0.6, maxLife: 0.6, color: 'rgba(168,85,247,0.4)'
            });
            return;
        }
        this.running = false;
        this.callbacks.onGameOver(this.kills);
    }

    // ─── Draw ───
    private draw() {
        const ctx = this.ctx;
        const bg = this.assets.get('bg');
        if (bg && this.assetsLoaded.has('bg')) ctx.drawImage(bg, 0, 0, this.W, this.H);
        else { ctx.fillStyle = '#1e1b4b'; ctx.fillRect(0, 0, this.W, this.H); }

        ctx.save();
        if (this.screenshake > 0) {
            ctx.translate((Math.random()-0.5)*this.screenshake*20, (Math.random()-0.5)*this.screenshake*20);
        }

        this.drawObstacles();
        for (const e of this.enemies) this.drawEnemy(e);
        this.drawBoss();

        // Projectiles
        for (const p of this.projectiles) {
            ctx.save(); ctx.translate(p.x, p.y);
            if (p.rotation !== undefined) ctx.rotate(p.rotation);
            if (p.assetKey === 'flecha' && this.assetsLoaded.has('flecha')) {
                ctx.rotate(Math.PI);
                const img = this.assets.get('flecha')!;
                const sw = 48*(p.scale||1), sh = 20*(p.scale||1);
                ctx.drawImage(img, -sw/2, -sh/2, sw, sh);
            } else {
                ctx.beginPath(); ctx.arc(0,0,p.radius,0,Math.PI*2);
                ctx.fillStyle = p.color;
                if (!p.fromPlayer) { ctx.shadowBlur = 12; ctx.shadowColor = p.color; }
                ctx.fill(); ctx.shadowBlur = 0;
            }
            ctx.restore();
        }

        // AoE
        for (const a of this.aoeEffects) {
            ctx.save(); ctx.globalAlpha = (a.life/a.maxLife)*0.6;
            ctx.beginPath();
            if (a.type === 'cone') {
                ctx.moveTo(a.x, a.y);
                ctx.arc(a.x, a.y, a.radius, a.startAngle!, a.endAngle!);
                ctx.closePath();
            } else {
                ctx.arc(a.x, a.y, a.radius, 0, Math.PI*2);
            }
            ctx.fillStyle = a.color; ctx.fill(); ctx.restore();
        }

        // Damage numbers
        for (const n of this.damageNums) {
            ctx.save();
            ctx.globalAlpha = n.life/0.9;
            ctx.font = '12px "Press Start 2P", "MedievalSharp", cursive';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.strokeText(String(Math.round(n.val)), n.x, n.y);
            ctx.fillStyle = n.color;
            ctx.fillText(String(Math.round(n.val)), n.x, n.y);
            
            if (n.color === '#fbbf24' || n.color === '#fde047') {
                const sacImg = this.assets.get('goldsac');
                if (sacImg && this.assetsLoaded.has('goldsac')) {
                    const txtWidth = ctx.measureText(String(Math.round(n.val))).width;
                    ctx.drawImage(sacImg, n.x + txtWidth/2 + 2, n.y - 12, 16, 16);
                }
            }
            ctx.restore();
        }

        ctx.restore();
        this.drawPlayer();
    }

    private drawObstacles() {
        const ctx = this.ctx, img = this.assets.get('obstaculo');
        for (const obs of this.obstacles) {
            if (img && this.assetsLoaded.has('obstaculo'))
                ctx.drawImage(img, obs.x-obs.radius, obs.y-obs.radius, obs.radius*2, obs.radius*2);
            else { ctx.beginPath(); ctx.arc(obs.x,obs.y,obs.radius,0,Math.PI*2); ctx.fillStyle='#475569'; ctx.fill(); }
        }
    }

    private drawPlayer() {
        const p = this.player, ctx = this.ctx, SIZE = 80;
        const blink = p.invincible && Math.floor(p.invincibleTimer*10)%2===0;
        if (blink) return;

        if (p.skillActive) {
            ctx.beginPath(); ctx.arc(p.x,p.y,SIZE*0.9,0,Math.PI*2);
            ctx.fillStyle='rgba(255,215,0,0.25)'; ctx.fill();
        }

        const imgKey = p.state==='idle' ? (
            p.moveMode==='up' ? 'bueno_idle_back' :
            p.moveMode==='down' ? 'bueno_idle_front' :
            p.direction===1 ? 'bueno_idle_right' : 'bueno_idle_left'
        ) : p.state==='run' ? (
            p.moveMode==='up' ? `bueno_run_up_${p.frame}` :
            p.moveMode==='down' ? `bueno_run_down_${p.frame}` :
            p.direction===1 ? `bueno_run_right_${p.frame}` : `bueno_run_left_${p.frame}`
        ) : ( // attack
            p.direction===1 ? `bueno_attack_right_${p.frame}` : `bueno_attack_left_${p.frame}`
        );

        const img = this.assets.get(imgKey);
        if (img && this.assetsLoaded.has(imgKey)) {
            ctx.drawImage(img, p.x-SIZE/2, p.y-SIZE/2, SIZE, SIZE);
        } else {
            // ROBUST FALLBACK
            const fallbackKey = p.direction === 1 ? 'bueno_idle_right' : 'bueno_idle_left';
            const fallbackImg = this.assets.get(fallbackKey);
            if (fallbackImg && this.assetsLoaded.has(fallbackKey)) {
                ctx.drawImage(fallbackImg, p.x - SIZE/2, p.y - SIZE/2, SIZE, SIZE);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, SIZE/2.5, 0, Math.PI*2);
                ctx.fillStyle = p.clase === 'guerrero' ? '#ef4444' : '#22c55e';
                ctx.fill();
            }
        }

        const barW = 36, filled = (p.hp/p.maxHp)*barW;
        ctx.fillStyle='#000000aa'; ctx.fillRect(p.x-barW/2-1, p.y-SIZE-10, barW+2, 7);
        ctx.fillStyle = p.hp>p.maxHp*0.5?'#22c55e':p.hp>p.maxHp*0.25?'#eab308':'#ef4444';
        ctx.fillRect(p.x-barW/2, p.y-SIZE-9, filled, 5);
    }

    private drawEnemy(e: SandboxEnemy) {
        const ctx = this.ctx;
        const size = e.type==='tank' ? 100 : e.type==='sprinter' ? 55 : 75;

        const imgKey = e.state==='idle' ? 'malo_idle' :
            e.state==='run' ? (
                e.moveMode==='up'   ? `malo_run_up_${e.frame}` :
                e.moveMode==='down' ? `malo_run_down_${e.frame}` : `malo_run_side_${e.frame}`
            ) : `malo_attack_${e.frame}`;

        const img = this.assets.get(imgKey);
        if (img && this.assetsLoaded.has(imgKey)) {
            let drawX = e.x - size/2;
            let drawY = e.y - size/2;
            ctx.save();
            if (e.direction === -1) { ctx.translate(e.x*2, 0); ctx.scale(-1,1); }
            const tint = e.type==='tank'?'rgba(120,0,180,0.4)':e.type==='sprinter'?'rgba(0,200,220,0.35)':null;
            
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
            ctx.beginPath(); ctx.arc(e.x,e.y,size/2,0,Math.PI*2);
            ctx.fillStyle = e.type==='tank'?'#7c3aed':e.type==='sprinter'?'#06b6d4':'#ef4444'; ctx.fill();
        }
        // HP bar - common style
        const barW = size * 0.8, barH = 6, filled = Math.max(0, (e.hp/e.maxHp)*barW);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - barW/2, e.y - size/2 - 12, barW, barH);
        ctx.fillStyle = e.hp > e.maxHp * 0.5 ? '#22c55e' : e.hp > e.maxHp * 0.25 ? '#eab308' : '#ef4444';
        ctx.fillRect(e.x - barW/2, e.y - size/2 - 12, filled, barH);
    }

    private drawBoss() {
        if (!this.bossActive) return;

        const ctx = this.ctx;
        const frameKey = `boss_frame_${this.bossFrame}`;
        let renderObj: HTMLImageElement | null | undefined = this.assets.get(frameKey);
        if (!renderObj || !this.assetsLoaded.has(frameKey)) renderObj = this.assets.get('boss');

        // Normalize rendering to prevent twitching
        const targetW = 180;
        const aspect = renderObj ? renderObj.width / (renderObj.height || 1) : 1;
        const rw = targetW;
        const rh = targetW / aspect;

        let bx = this.bossX, by = this.bossY;
        const baseWidth = 30;

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

        // Plasma ray
        if (this.bossState === 'firing') {
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(this.bossBeamAngle);

            const rayKey = `ray_${(Math.floor(this.bossFrame * 8 / 12)) % 8}`;
            const rayImg = this.assets.get(rayKey);
            if (rayImg && this.assetsLoaded.has(rayKey)) {
                // Draw the ray sprite stretched across the whole beam
                ctx.drawImage(rayImg, 0, -baseWidth, 1500, baseWidth * 2);
            } else {
                // Fallback gradient beam if no sprite
            }

            const g1 = ctx.createLinearGradient(0, -baseWidth, 0, baseWidth);
            g1.addColorStop(0, 'rgba(255,50,50,0)'); g1.addColorStop(0.5, 'rgba(255,50,50,0.6)'); g1.addColorStop(1, 'rgba(255,50,50,0)');
            ctx.fillStyle = g1; ctx.fillRect(0, -baseWidth, 1500, baseWidth*2);
            
            const g2 = ctx.createLinearGradient(0, -baseWidth/2, 0, baseWidth/2);
            g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, 'rgba(255,255,255,0.9)'); g2.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g2; ctx.fillRect(0, -baseWidth/2, 1500, baseWidth);
            
            ctx.restore();
        }

        // Boss sprite
        if (this.bossShake > 0) {
            bx += (Math.random()-0.5)*this.bossShake*5;
            by += (Math.random()-0.5)*this.bossShake*5;
            this.bossShake -= 0.1;
        }
        if (renderObj) ctx.drawImage(renderObj, bx-rw/2, by-rh/2, rw, rh);
        else { ctx.beginPath(); ctx.arc(bx,by,60,0,Math.PI*2); ctx.fillStyle='#ef4444'; ctx.fill(); }

        // Lasers
        for (const laser of this.lasers) {
            ctx.save(); ctx.translate(laser.x, laser.y); ctx.rotate(laser.angle);
            const alpha = laser.isWarning ? (Math.sin(laser.life*10)*0.5+0.5)*0.6 : 1.0;
            const color = laser.isWarning ? '255, 255, 0' : '255, 0, 0';
            const width = laser.isWarning ? laser.width*0.5 : laser.width;
            const gOuter = ctx.createLinearGradient(0, -width, 0, width);
            gOuter.addColorStop(0, `rgba(${color},0)`); gOuter.addColorStop(0.5, `rgba(${color},${alpha*0.4})`); gOuter.addColorStop(1, `rgba(${color},0)`);
            ctx.fillStyle = gOuter; ctx.fillRect(0, -width, 2000, width*2);
            const gInner = ctx.createLinearGradient(0, -width*0.6, 0, width*0.6);
            gInner.addColorStop(0, `rgba(${color},0)`); gInner.addColorStop(0.5, `rgba(${color},${alpha*0.8})`); gInner.addColorStop(1, `rgba(${color},0)`);
            ctx.fillStyle = gInner; ctx.fillRect(0, -width*0.6, 2000, width*1.2);
            ctx.restore();
        }
    }

    public stop() {
        this.running = false;
        cancelAnimationFrame(this.animFrameId);
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
        window.removeEventListener('mouseup', this.mouseUpHandler);
    }
}


/**
 * BulletHell.ts — Modo Bullet Hell con control de teclado (WASD + Flechas).
 * El jugador esquiva proyectiles que aumentan en densidad y velocidad con el tiempo.
 */

import arrowImgUrl from '../../assets/weapons/flecha.png';

const BUENO_FRAMES = {
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
    ]
};

export type BulletPattern = 'espiral' | 'cortina' | 'embudo' | 'aleatorio' | 'radial' | 'lluvia' | 'laser' | 'triple-spiral' | 'radial-wave' | 'laser-grid' | 'cross-lasers' | 'flurry' | 'splurt' | 'mega-spiral';

interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    rotation: number;
    warningTimer: number; // New warning phase
}

interface Laser {
    x: number;
    y: number;
    angle: number;
    width: number;
    life: number;
    maxLife: number;
    isWarning: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface KeyState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export class BulletHell {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Player logical state
    private playerX: number;
    private playerY: number;
    private playerRadius: number = 28;
    private playerSpeed: number = 220; // px/s

    // Invincibility
    private invincible: boolean = false;
    private invincibleTimer: number = 0;

    // Bullets & Lasers
    private bullets: Bullet[] = [];
    private lasers: Laser[] = [];
    private particles: Particle[] = [];

    // Screen effects
    private screenShake: number = 0;
    private hitFlash: number = 0;

    // Game state
    private lives: number;
    private maxLives: number;
    private elapsed: number = 0;
    private lastTime: number = 0;
    private ticksSinceSpawn: number = 0;
    private running: boolean = false;
    private frameId: number = 0;

    // Player Animation state
    private state: 'idle' | 'run' = 'idle';
    private direction: number = 1;
    private frame: number = 0;
    private frameTimer: number = 0;
    private moveMode: 'up' | 'down' | 'horizontal' = 'horizontal';

    private assets: Map<string, HTMLImageElement> = new Map();
    private assetsLoaded: Set<string> = new Set();

    // Keyboard state
    private keys: KeyState = { up: false, down: false, left: false, right: false };
    private keyHandler: (e: KeyboardEvent) => void;
    private keyUpHandler: (e: KeyboardEvent) => void;

    // Assets
    private bgImg: HTMLImageElement | null = null;
    private bgLoaded: boolean = false;

    // Callbacks
    private onLivesChange: (lives: number) => void;
    private onTimeChange: (elapsed: number) => void;
    private onGameOver: (survived: number) => void;

    constructor(
        canvas: HTMLCanvasElement,
        lives: number,
        bgImgUrl: string,
        onLivesChange: (l: number) => void,
        onTimeChange: (t: number) => void,
        onGameOver: (t: number) => void
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.lives = lives;
        this.maxLives = lives;
        this.onLivesChange = onLivesChange;
        this.onTimeChange = onTimeChange;
        this.onGameOver = onGameOver;

        // Start in center
        this.playerX = canvas.width / 2;
        this.playerY = canvas.height / 2;

        this.bgImg = new Image();
        this.bgImg.src = bgImgUrl;
        this.bgImg.onload = () => { this.bgLoaded = true; };

        this.loadAssets();

        // Keyboard setup
        this.keyHandler = (e: KeyboardEvent) => this.onKeyDown(e);
        this.keyUpHandler = (e: KeyboardEvent) => this.onKeyUp(e);
        window.addEventListener('keydown', this.keyHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    }

    private loadAssets(): void {
        const frames = [
            { key: 'bueno_idle_front', src: Object.values(BUENO_FRAMES.idleFront)[0] as string },
            { key: 'bueno_idle_back', src: Object.values(BUENO_FRAMES.idleBack)[0] as string },
            { key: 'bueno_idle_left', src: Object.values(BUENO_FRAMES.idleLeft)[0] as string },
            { key: 'bueno_idle_right', src: Object.values(BUENO_FRAMES.idleRight)[0] as string },
            ...BUENO_FRAMES.runFront.map((f, i) => ({ key: `bueno_run_down_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_FRAMES.runBack.map((f, i) => ({ key: `bueno_run_up_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_FRAMES.runLeft.map((f, i) => ({ key: `bueno_run_left_${i}`, src: Object.values(f)[0] as string })),
            ...BUENO_FRAMES.runRight.map((f, i) => ({ key: `bueno_run_right_${i}`, src: Object.values(f)[0] as string })),
            { key: 'flecha', src: arrowImgUrl }
        ];

        for (const f of frames) {
            const img = new Image();
            img.src = f.src;
            img.onload = () => this.assetsLoaded.add(f.key);
            this.assets.set(f.key, img);
        }
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (!this.running) return;
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W': this.keys.up = true; e.preventDefault(); break;
            case 'ArrowDown': case 's': case 'S': this.keys.down = true; e.preventDefault(); break;
            case 'ArrowLeft': case 'a': case 'A': this.keys.left = true; e.preventDefault(); break;
            case 'ArrowRight': case 'd': case 'D': this.keys.right = true; e.preventDefault(); break;
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W': this.keys.up = false; break;
            case 'ArrowDown': case 's': case 'S': this.keys.down = false; break;
            case 'ArrowLeft': case 'a': case 'A': this.keys.left = false; break;
            case 'ArrowRight': case 'd': case 'D': this.keys.right = false; break;
        }
    }

    public start(): void {
        this.running = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    public stop(): void {
        this.running = false;
        cancelAnimationFrame(this.frameId);
        // Remove keyboard listeners
        window.removeEventListener('keydown', this.keyHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
    }

    private loop(timestamp: number): void {
        if (!this.running) return;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;
        this.elapsed += dt;
        this.update(dt);
        this.draw();
        this.onTimeChange(this.elapsed);
        this.frameId = requestAnimationFrame((t) => this.loop(t));
    }

    private update(dt: number): void {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = this.playerRadius + 5;

        // Player movement from keyboard
        let dx = 0, dy = 0;
        if (this.keys.up) dy -= 1;
        if (this.keys.down) dy += 1;
        if (this.keys.left) dx -= 1;
        if (this.keys.right) dx += 1;

        // Normalize diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        this.playerX = Math.max(margin, Math.min(w - margin, this.playerX + dx * this.playerSpeed * dt));
        this.playerY = Math.max(margin, Math.min(h - margin, this.playerY + dy * this.playerSpeed * dt));

        // Update player animation state
        if (dx !== 0 || dy !== 0) {
            this.state = 'run';
            if (Math.abs(dy) > Math.abs(dx) * 1.5) {
                this.moveMode = dy < 0 ? 'up' : 'down';
            } else {
                this.moveMode = 'horizontal';
                if (Math.abs(dx) > 0.1) this.direction = dx > 0 ? 1 : -1;
            }
        } else {
            this.state = 'idle';
        }

        this.frameTimer += dt;
        if (this.frameTimer > 0.1) {
            this.frameTimer = 0;
            if (this.state === 'run') {
                const max = this.moveMode === 'up' ? 4 : this.moveMode === 'down' ? 2 : 5;
                this.frame = (this.frame + 1) % max;
            } else {
                this.frame = 0;
            }
        }

        // Invincibility countdown
        if (this.invincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // Update lasers
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.life -= dt;
            if (l.life <= 0) {
                this.lasers.splice(i, 1);
                continue;
            }
            if (l.isWarning && l.life < l.maxLife * 0.3) {
                l.isWarning = false;
                l.life = 0.6; // Active phase duration
                l.maxLife = 0.6;
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Update screen effects
        if (this.screenShake > 0) {
            this.screenShake -= dt * 15;
            if (this.screenShake < 0) this.screenShake = 0;
        }
        if (this.hitFlash > 0) {
            this.hitFlash -= dt * 2;
            if (this.hitFlash < 0) this.hitFlash = 0;
        }

        // Difficulty: escalates over time
        const difficulty = 1 + Math.floor(this.elapsed / 10) * 0.5; // Slightly slower scaling
        const spawnRate = Math.max(0.4, 2.0 - this.elapsed * 0.02); // Less dense initial spawns

        this.ticksSinceSpawn += dt;
        if (this.ticksSinceSpawn >= spawnRate) {
            this.ticksSinceSpawn = 0;
            this.spawnPattern(difficulty);
        }

        // Move bullets (speed scales with difficulty)
        const bulletSpeed = 1 + difficulty * 0.25;
        for (const b of this.bullets) {
            if (b.warningTimer > 0) {
                b.warningTimer -= dt;
            } else {
                b.x += b.vx * bulletSpeed;
                b.y += b.vy * bulletSpeed;
            }
        }

        // Cull off-screen
        const cull = 60;
        this.bullets = this.bullets.filter(b =>
            b.x > -cull && b.x < w + cull && b.y > -cull && b.y < h + cull
        );

        // Collision detection
        if (!this.invincible) {
            // Bullet Collision
            for (const b of this.bullets) {
                if (b.warningTimer > 0) continue; // No hitting during warning phase
                const ddx = b.x - this.playerX;
                const ddy = b.y - this.playerY;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dist < b.radius + this.playerRadius * 0.4) {
                    this.onHit();
                    break;
                }
            }
            // Laser Collision
            if (!this.invincible) {
                for (const l of this.lasers) {
                    if (l.isWarning) continue;
                    // Distance from point to line
                    const px = this.playerX - l.x;
                    const py = this.playerY - l.y;
                    const cosA = Math.cos(l.angle);
                    const sinA = Math.sin(l.angle);
                    // Projection onto the line perpendicular to the laser
                    const distToLine = Math.abs(px * sinA - py * cosA);
                    if (distToLine < l.width / 2 + this.playerRadius * 0.3) {
                        this.onHit();
                        break;
                    }
                }
            }
        }
    }

    private onHit(): void {
        this.lives--;
        this.onLivesChange(this.lives);
        this.invincible = true;
        this.invincibleTimer = 1.8;
        this.bullets = [];
        this.lasers = [];
        this.screenShake = 12;
        this.hitFlash = 0.5;

        // Spawn some particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            this.particles.push({
                x: this.playerX,
                y: this.playerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 1.0,
                color: '#ef4444',
                size: 2 + Math.random() * 3
            });
        }

        if (this.lives <= 0) {
            this.running = false;
            this.draw();
            this.onGameOver(Math.floor(this.elapsed));
        }
    }

    private spawnPattern(difficulty: number): void {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const count = Math.floor(10 + difficulty * 5);

        const patterns: BulletPattern[] = ['espiral', 'cortina', 'embudo', 'aleatorio', 'radial', 'lluvia', 'laser'];
        if (this.elapsed > 20) {
            patterns.push('triple-spiral', 'radial-wave', 'flurry', 'splurt');
        }
        if (this.elapsed > 45) {
            patterns.push('laser-grid', 'cross-lasers', 'mega-spiral');
        }
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        if (pattern === 'espiral') {
            const cx = w / 2, cy = h / 2;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 + this.elapsed * 1.5;
                const speed = 2.8;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                this.bullets.push({ 
                    x: cx, y: cy, vx, vy, 
                    radius: 12, color: '#f97316', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 1.2
                });
            }
        } else if (pattern === 'cortina') {
            const step = w / count;
            for (let i = 0; i < count; i++) {
                const x = i * step + Math.random() * (step / 2);
                const vx = (Math.random() - 0.5) * 0.5;
                const vy = 3 + Math.random() * 2;
                this.bullets.push({ 
                    x, y: -20, vx, vy, 
                    radius: 10, color: '#dc2626', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 0.8
                });
            }
        } else if (pattern === 'embudo') {
            const sides = [
                { x: 0, y: h / 2, vx: 3.5, vy: 0 },
                { x: w, y: h / 2, vx: -3.5, vy: 0 },
                { x: w / 2, y: 0, vx: 0, vy: 3.5 },
                { x: w / 2, y: h, vx: 0, vy: -3.5 }
            ];
            for (const s of sides) {
                for (let i = 0; i < Math.ceil(count / 4); i++) {
                    const spr = (i - count / 8) * 0.35;
                    const vx = s.vx + (s.vy !== 0 ? spr : 0);
                    const vy = s.vy + (s.vx !== 0 ? spr : 0);
                    this.bullets.push({ 
                        x: s.x, y: s.y, vx, vy, 
                        radius: 12, color: '#a855f7', 
                        rotation: Math.atan2(vy, vx) + Math.PI,
                        warningTimer: 0.8
                    });
                }
            }
        } else if (pattern === 'radial') {
            const edge = Math.floor(Math.random() * 4);
            let ox = 0, oy = 0;
            if (edge === 0) { ox = Math.random() * w; oy = 0; }
            else if (edge === 1) { ox = w; oy = Math.random() * h; }
            else if (edge === 2) { ox = Math.random() * w; oy = h; }
            else { ox = 0; oy = Math.random() * h; }
            const base = Math.atan2(this.playerY - oy, this.playerX - ox);
            for (let i = 0; i < count; i++) {
                const ang = base + (Math.random() - 0.5) * 0.8;
                const spd = 2.5 + Math.random() * 1.5;
                const vx = Math.cos(ang) * spd;
                const vy = Math.sin(ang) * spd;
                this.bullets.push({ 
                    x: ox, y: oy, vx, vy, 
                    radius: 12, color: '#ef4444', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 1.0
                });
            }
        } else if (pattern === 'lluvia') {
            for (let i = 0; i < count * 1.5; i++) {
                const x = Math.random() * w;
                const vx = 0;
                const vy = 4 + Math.random() * 3;
                this.bullets.push({ 
                    x, y: -50 - Math.random() * 200, vx, vy, 
                    radius: 9, color: '#60a5fa', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 0.5
                });
            }
        } else if (pattern === 'triple-spiral') {
            const cx = w / 2, cy = h / 2;
            const spirals = 3;
            for (let s = 0; s < spirals; s++) {
                const offset = (s / spirals) * Math.PI * 2;
                for (let i = 0; i < count / spirals; i++) {
                    const angle = (i / (count / spirals)) * Math.PI * 2 + this.elapsed * 2 + offset;
                    const spd = 3.2;
                    const vx = Math.cos(angle) * spd;
                    const vy = Math.sin(angle) * spd;
                    this.bullets.push({ 
                        x: cx, y: cy, vx, vy, 
                        radius: 10, color: '#fca5a5', 
                        rotation: Math.atan2(vy, vx) + Math.PI,
                        warningTimer: 1.5
                    });
                }
            }
        } else if (pattern === 'radial-wave') {
            const cx = w / 2, cy = h / 2;
            for (let i = 0; i < count * 1.5; i++) {
                const angle = (i / (count * 1.5)) * Math.PI * 2;
                const spd = 2.5 + Math.sin(i * 0.5) * 1.0;
                const vx = Math.cos(angle) * spd;
                const vy = Math.sin(angle) * spd;
                this.bullets.push({ 
                    x: cx, y: cy, vx, vy, 
                    radius: 9, color: '#93c5fd', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 1.2
                });
            }
        } else if (pattern === 'laser') {
            const lCount = Math.floor(2 + difficulty * 0.5);
            for (let i = 0; i < lCount; i++) {
                const side = Math.floor(Math.random() * 2);
                if (side === 0) {
                    this.lasers.push({
                        x: 0, y: Math.random() * h,
                        angle: 0, width: 30,
                        life: 1.2, maxLife: 1.2, isWarning: true
                    });
                } else {
                    this.lasers.push({
                        x: Math.random() * w, y: 0,
                        angle: Math.PI / 2, width: 30,
                        life: 1.2, maxLife: 1.2, isWarning: true
                    });
                }
            }
        } else if (pattern === 'laser-grid') {
            const spacing = 150;
            for (let x = spacing; x < w; x += spacing) {
                this.lasers.push({ x, y: 0, angle: Math.PI / 2, width: 40, life: 1.5, maxLife: 1.5, isWarning: true });
            }
            for (let y = spacing; y < h; y += spacing) {
                this.lasers.push({ x: 0, y, angle: 0, width: 40, life: 1.5, maxLife: 1.5, isWarning: true });
            }
        } else if (pattern === 'cross-lasers') {
            this.lasers.push({ x: this.playerX, y: 0, angle: Math.PI / 2, width: 60, life: 1.5, maxLife: 1.5, isWarning: true });
            this.lasers.push({ x: 0, y: this.playerY, angle: 0, width: 60, life: 1.5, maxLife: 1.5, isWarning: true });
        } else if (pattern === 'flurry') {
            const ang = Math.atan2(this.playerY - h / 2, this.playerX - w / 2);
            for (let i = 0; i < count; i++) {
                const spread = (Math.random() - 0.5) * 0.4;
                const spd = 4 + Math.random() * 2;
                this.bullets.push({
                    x: w / 2, y: h / 2,
                    vx: Math.cos(ang + spread) * spd,
                    vy: Math.sin(ang + spread) * spd,
                    radius: 10, color: '#f87171',
                    rotation: ang + spread + Math.PI,
                    warningTimer: 0.5
                });
            }
        } else if (pattern === 'splurt') {
            for (let i = 0; i < 5; i++) {
                const spX = Math.random() * w;
                const spY = Math.random() * h;
                for (let j = 0; j < 8; j++) {
                    const ang = (j / 8) * Math.PI * 2;
                    this.bullets.push({
                        x: spX, y: spY,
                        vx: Math.cos(ang) * 3,
                        vy: Math.sin(ang) * 3,
                        radius: 8, color: '#fbbf24',
                        rotation: ang + Math.PI,
                        warningTimer: 1.0
                    });
                }
            }
        } else if (pattern === 'mega-spiral') {
            const arms = 6;
            for (let a = 0; a < arms; a++) {
                const offset = (a / arms) * Math.PI * 2;
                for (let i = 0; i < 15; i++) {
                    const ang = offset + i * 0.2 + this.elapsed * 3;
                    this.bullets.push({
                        x: w / 2, y: h / 2,
                        vx: Math.cos(ang) * 4,
                        vy: Math.sin(ang) * 4,
                        radius: 10, color: '#818cf8',
                        rotation: ang + Math.PI,
                        warningTimer: 2.0
                    });
                }
            }
        } else {
            // Random scattering from one edge (aleatorio)
            const edge = Math.floor(Math.random() * 4);
            let ox = 0, oy = 0;
            if (edge === 0) { ox = Math.random() * w; oy = 0; }
            else if (edge === 1) { ox = w; oy = Math.random() * h; }
            else if (edge === 2) { ox = Math.random() * w; oy = h; }
            else { ox = 0; oy = Math.random() * h; }
            const baseAng = Math.atan2(h / 2 - oy, w / 2 - ox);
            for (let i = 0; i < count; i++) {
                const ang = baseAng + (Math.random() - 0.5) * 1.5;
                const spd = 2 + Math.random() * 2;
                const vx = Math.cos(ang) * spd;
                const vy = Math.sin(ang) * spd;
                this.bullets.push({ 
                    x: ox, y: oy, vx, vy, 
                    radius: 8, color: '#eab308', 
                    rotation: Math.atan2(vy, vx) + Math.PI,
                    warningTimer: 0.8
                });
            }
        }
    }

    private draw(): void {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Background
        if (this.bgLoaded && this.bgImg) {
            ctx.drawImage(this.bgImg, 0, 0, w, h);
        } else {
            ctx.fillStyle = '#0c0a09';
            ctx.fillRect(0, 0, w, h);
        }

        // Apply screen shake
        if (this.screenShake > 0) {
            const sx = (Math.random() - 0.5) * this.screenShake;
            const sy = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(sx, sy);
        }

        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        // Bullets
        for (const b of this.bullets) {
            if (b.warningTimer > 0) {
                // Draw warning line
                ctx.save();
                ctx.setLineDash([8, 6]);
                const pulse = 0.5 + Math.sin(this.elapsed * 12) * 0.5;
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.4})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                const lineLength = 1200;
                ctx.lineTo(b.x + b.vx * lineLength, b.y + b.vy * lineLength);
                ctx.stroke();
                
                // Pulsing dot at start with glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ef4444';
                ctx.globalAlpha = 0.4 + pulse * 0.6;
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, Math.PI*2); ctx.fill();
                ctx.restore();
            } else {
                if (this.assetsLoaded.has('flecha')) {
                    const img = this.assets.get('flecha')!;
                    const size = b.radius * 2.8;
                    ctx.save();
                    ctx.translate(b.x, b.y);
                    // Add yellowish aura glow using a nearly invisible circle
                    ctx.save();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#fef08a'; // Yellowish aura
                    ctx.beginPath();
                    ctx.arc(0, 0, b.radius * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0,0,0,0.01)';
                    ctx.fill();
                    ctx.restore();
                    
                    ctx.rotate(b.rotation);
                    ctx.drawImage(img, -size / 2, -size / 2, size, size);
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                    ctx.fillStyle = b.color;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = b.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Lasers
        for (const l of this.lasers) {
            ctx.save();
            ctx.translate(l.x, l.y);
            ctx.rotate(l.angle);
            const length = 3000;

            if (l.isWarning) {
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 10]);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(length, 0);
                ctx.lineTo(-length, 0);
                ctx.stroke();
            } else {
                const alpha = l.life / l.maxLife;
                const grad = ctx.createLinearGradient(0, -l.width/2, 0, l.width/2);
                grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
                grad.addColorStop(0.5, `rgba(239, 68, 68, ${0.8 * alpha})`);
                grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
                
                ctx.fillStyle = grad;
                ctx.fillRect(-length, -l.width/2, length*2, l.width);
                
                // Core beam
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.fillRect(-length, -2, length*2, 4);
            }
            ctx.restore();
        }

        // Draw particles
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // WASD hint (fade after 5s)
        if (this.elapsed < 5) {
            const alpha = Math.max(0, 1 - this.elapsed / 3);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(212,175,55,0.9)';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('WASD / ↑↓←→ para moverte • Esquiva las balas', w / 2, h - 30);
            ctx.globalAlpha = 1;
        }

        // Player
        const blink = this.invincible && Math.floor(this.invincibleTimer * 10) % 2 === 0;
        if (!blink) {
            const size = this.playerRadius * 2.2;
            
            // Glow removed

            if (this.state === 'idle') {
                const key = this.moveMode === 'up' ? 'bueno_idle_back' : this.moveMode === 'down' ? 'bueno_idle_front' : (this.direction === 1 ? 'bueno_idle_right' : 'bueno_idle_left');
                const img = this.assets.get(key);
                if (img && this.assetsLoaded.has(key)) {
                    this.drawSprite(img, this.playerX, this.playerY, size);
                }
            } else {
                const key = this.moveMode === 'up' ? `bueno_run_up_${this.frame}` : this.moveMode === 'down' ? `bueno_run_down_${this.frame}` : (this.direction === 1 ? `bueno_run_right_${this.frame}` : `bueno_run_left_${this.frame}`);
                const img = this.assets.get(key);
                if (img && this.assetsLoaded.has(key)) {
                    this.drawSprite(img, this.playerX, this.playerY, size);
                }
            }

            // Hitbox dot
            ctx.beginPath();
            ctx.arc(this.playerX, this.playerY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }

        // Hit Flash Overlay
        if (this.hitFlash > 0) {
            ctx.fillStyle = `rgba(239, 68, 68, ${this.hitFlash * 0.4})`;
            ctx.fillRect(-100, -100, w + 200, h + 200); // larger to cover shake
        }

        // Restore translation from screen shake
        if (this.screenShake > 0) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    private drawSprite(img: HTMLImageElement, x: number, y: number, size: number): void {
        const ctx = this.ctx;
        // Automatic Sheet Detection: if image is significantly wider than high
        if (img.width > img.height * 1.2) {
            const frameWidth = img.height; // Assume square frames in horizontal sheet
            const cols = Math.floor(img.width / frameWidth);
            // If it's the run animation, use this.frame, otherwise use frame 0
            const f = (this.state === 'run') ? (this.frame % cols) : 0;
            ctx.drawImage(img, f * frameWidth, 0, frameWidth, img.height, x - size / 2, y - size / 2, size, size);
        } else {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        }
    }

    public getLives(): number { return this.lives; }
    public getMaxLives(): number { return this.maxLives; }
    public getElapsed(): number { return this.elapsed; }
}

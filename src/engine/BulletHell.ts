/**
 * BulletHell.ts — Modo Bullet Hell con control de teclado (WASD + Flechas).
 * El jugador esquiva proyectiles que aumentan en densidad y velocidad con el tiempo.
 */

export type BulletPattern = 'espiral' | 'cortina' | 'embudo' | 'aleatorio' | 'radial';

interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
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
    private playerRadius: number = 14;
    private playerSpeed: number = 220; // px/s

    // Invincibility
    private invincible: boolean = false;
    private invincibleTimer: number = 0;

    // Bullets
    private bullets: Bullet[] = [];

    // Game state
    private lives: number;
    private maxLives: number;
    private elapsed: number = 0;
    private lastTime: number = 0;
    private ticksSinceSpawn: number = 0;
    private running: boolean = false;
    private frameId: number = 0;

    // Keyboard state
    private keys: KeyState = { up: false, down: false, left: false, right: false };
    private keyHandler: (e: KeyboardEvent) => void;
    private keyUpHandler: (e: KeyboardEvent) => void;

    // Background
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

        // Background
        this.bgImg = new Image();
        this.bgImg.src = bgImgUrl;
        this.bgImg.onload = () => { this.bgLoaded = true; };

        // Keyboard setup
        this.keyHandler = (e: KeyboardEvent) => this.onKeyDown(e);
        this.keyUpHandler = (e: KeyboardEvent) => this.onKeyUp(e);
        window.addEventListener('keydown', this.keyHandler);
        window.addEventListener('keyup', this.keyUpHandler);
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

        // Invincibility countdown
        if (this.invincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // Difficulty: escalates over time
        const difficulty = 1 + Math.floor(this.elapsed / 8) * 0.6;
        const spawnRate = Math.max(0.25, 1.8 - this.elapsed * 0.025);

        this.ticksSinceSpawn += dt;
        if (this.ticksSinceSpawn >= spawnRate) {
            this.ticksSinceSpawn = 0;
            this.spawnPattern(difficulty);
        }

        // Move bullets (speed scales with difficulty)
        const bulletSpeed = 1 + difficulty * 0.25;
        for (const b of this.bullets) {
            b.x += b.vx * bulletSpeed;
            b.y += b.vy * bulletSpeed;
        }

        // Cull off-screen
        const cull = 60;
        this.bullets = this.bullets.filter(b =>
            b.x > -cull && b.x < w + cull && b.y > -cull && b.y < h + cull
        );

        // Collision detection
        if (!this.invincible) {
            for (const b of this.bullets) {
                const ddx = b.x - this.playerX;
                const ddy = b.y - this.playerY;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dist < b.radius + this.playerRadius * 0.6) {
                    this.lives--;
                    this.onLivesChange(this.lives);
                    this.invincible = true;
                    this.invincibleTimer = 1.8;
                    this.bullets = [];

                    if (this.lives <= 0) {
                        this.running = false;
                        this.draw();
                        this.onGameOver(Math.floor(this.elapsed));
                    }
                    break;
                }
            }
        }
    }

    private spawnPattern(difficulty: number): void {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const count = Math.floor(10 + difficulty * 5);

        const patterns: BulletPattern[] = ['espiral', 'cortina', 'embudo', 'aleatorio', 'radial'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        if (pattern === 'espiral') {
            const cx = w / 2, cy = h / 2;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 + this.elapsed * 1.2;
                const speed = 2.8;
                this.bullets.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: 8, color: '#f97316' });
            }
        } else if (pattern === 'cortina') {
            for (let i = 0; i < count; i++) {
                this.bullets.push({ x: Math.random() * w, y: -10, vx: (Math.random() - 0.5) * 1.5, vy: 3 + Math.random() * 2, radius: 7, color: '#dc2626' });
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
                    this.bullets.push({ x: s.x, y: s.y, vx: s.vx + spr, vy: s.vy + spr, radius: 8, color: '#a855f7' });
                }
            }
        } else if (pattern === 'radial') {
            // Aimed burst from edge toward player
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
                this.bullets.push({ x: ox, y: oy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, radius: 8, color: '#ef4444' });
            }
        } else {
            const edge = Math.floor(Math.random() * 4);
            let ox = 0, oy = 0;
            if (edge === 0) { ox = Math.random() * w; oy = 0; }
            else if (edge === 1) { ox = w; oy = Math.random() * h; }
            else if (edge === 2) { ox = Math.random() * w; oy = h; }
            else { ox = 0; oy = Math.random() * h; }
            const cx = w / 2, cy = h / 2;
            const baseAng = Math.atan2(cy - oy, cx - ox);
            for (let i = 0; i < count; i++) {
                const ang = baseAng + (Math.random() - 0.5) * 1.5;
                const spd = 2 + Math.random() * 2;
                this.bullets.push({ x: ox, y: oy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, radius: 7, color: '#eab308' });
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

        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        // Bullets
        for (const b of this.bullets) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.shadowBlur = 14;
            ctx.shadowColor = b.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

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
            ctx.beginPath();
            ctx.arc(this.playerX, this.playerY, this.playerRadius * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,175,55,0.12)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.playerX, this.playerY, this.playerRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.invincible ? '#60a5fa' : '#d4af37';
            ctx.shadowBlur = 22;
            ctx.shadowColor = this.invincible ? '#60a5fa' : '#d4af37';
            ctx.fill();
            ctx.shadowBlur = 0;

            // Hitbox dot
            ctx.beginPath();
            ctx.arc(this.playerX, this.playerY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    }

    public getLives(): number { return this.lives; }
    public getMaxLives(): number { return this.maxLives; }
    public getElapsed(): number { return this.elapsed; }
}

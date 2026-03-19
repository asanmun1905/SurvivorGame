import { Entidad } from '../entities/Entidad';
import bgImgUrl from '../../assets/Background/background.png';
import maloImgUrl from '../../assets/MaloMelee/IdleFront-removebg-preview.png';
import malo2ImgUrl from '../../assets/MaloRango/Necromancer_creativekind-Sheet.png';
import buenoImgUrl from '../../assets/BuenoMelee/Sprites/IdleFront.png';
import obsImgUrl from '../../assets/Obstacle/82cfbcc1-c0ad-4c07-91ae-ca682d039cb1_unnamed_1_-removebg-preview.png';
import bossImgUrl from '../../assets/bosses/BeholderFrame1.png';

/**
 * Clase responsable del renderizado visual y de la gestión lógica de la rejilla del tablero.
 * Incluye interpolación suave (lerp) entre posiciones de cuadrícula para movimiento fluido.
 */
export class Tablero {
    private ancho: number;
    private alto: number;
    private ctx: CanvasRenderingContext2D | null = null;
    private cellSize: number = 40;
    private assets: Map<string, HTMLImageElement> = new Map();
    private backgroundLoaded: boolean = false;

    // Smooth-render RAF loop
    private animFrameId: number = 0;
    private renderLoopActive: boolean = false;
    private extraDrawCallback: (() => void) | null = null;

    constructor(ancho: number, alto: number) {
        this.ancho = ancho;
        this.alto = alto;
        this.cargarAssets();
    }

    private cargarAssets(): void {
        const paths: Record<string, string> = {
            'background': bgImgUrl,
            'malo': maloImgUrl,
            'malo2': malo2ImgUrl,
            'bueno': buenoImgUrl,
            'obstaculo': obsImgUrl,
            'boss': bossImgUrl
        };

        for (const [key, path] of Object.entries(paths)) {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                if (key === 'background') this.backgroundLoaded = true;
            };
            this.assets.set(key, img);
        }
    }

    public resetDimensiones(ancho: number, alto: number): void {
        this.ancho = ancho;
        this.alto = alto;
    }

    public setContext(ctx: CanvasRenderingContext2D, cellSize: number): void {
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    public getAncho(): number { return this.ancho; }
    public getAlto(): number { return this.alto; }

    /**
     * Inicia un bucle de renderizado con rAF que interpola suavemente
     * las posiciones visuales de las entidades.
     * @param getEntidades Callback para obtener entidades actualizadas
     * @param extraDraw Extra drawing callback (e.g. BulletHell bullets)
     */
    public iniciarRenderLoop(
        getEntidades: () => Entidad[],
        extraDraw?: () => void
    ): void {
        this.extraDrawCallback = extraDraw ?? null;
        this.renderLoopActive = true;

        const LERP_SPEED = 0.18; // 0 = instant, 1 = no movement

        const tick = () => {
            if (!this.renderLoopActive) return;

            const entidades = getEntidades();
            // Lerp render positions toward logical positions
            for (const e of entidades) {
                e.renderX += (e.getX() - e.renderX) * (1 - LERP_SPEED);
                e.renderY += (e.getY() - e.renderY) * (1 - LERP_SPEED);
                // Snap when close enough
                if (Math.abs(e.renderX - e.getX()) < 0.01) e.renderX = e.getX();
                if (Math.abs(e.renderY - e.getY()) < 0.01) e.renderY = e.getY();
            }

            this.dibujarFrame(entidades);
            this.animFrameId = requestAnimationFrame(tick);
        };

        this.animFrameId = requestAnimationFrame(tick);
    }

    /** Stops the continuous rAF render loop */
    public detenerRenderLoop(): void {
        this.renderLoopActive = false;
        cancelAnimationFrame(this.animFrameId);
    }

    /**
     * One-shot draw (for sandbox initial render or static frames).
     */
    public dibujar(entidades: Entidad[]): void {
        if (!this.ctx) return;
        this.dibujarFrame(entidades);
    }

    private dibujarFrame(entidades: Entidad[]): void {
        if (!this.ctx) return;

        const canvas = this.ctx.canvas;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        const bgImg = this.assets.get('background');
        if (this.backgroundLoaded && bgImg) {
            this.ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
            this.ctx.fillStyle = '#0f172a';
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Extra draw layer (e.g. BulletHell background handled separately)
        if (this.extraDrawCallback) {
            this.extraDrawCallback();
        }

        // Entities
        for (const entidad of entidades) {
            this.dibujarEntidad(entidad);
        }
    }

    private dibujarEntidad(entidad: Entidad): void {
        if (!this.ctx) return;

        // Use smooth render position (lerped)
        const xPx = entidad.renderX * this.cellSize;
        const yPx = entidad.renderY * this.cellSize;
        const scale = entidad.getVisualScale();
        const tint = entidad.getTint();
        const assetKey = entidad.getAssetKey();
        const assetImg = this.assets.get(assetKey);
        const drawSize = this.cellSize * scale;
        // Center the scaled entity on the cell
        const offsetX = xPx - (drawSize - this.cellSize) / 2;
        const offsetY = yPx - (drawSize - this.cellSize) / 2;

        this.ctx.save();

        if (assetImg && assetImg.complete && assetImg.naturalWidth !== 0) {
            this.ctx.drawImage(assetImg, offsetX, offsetY, drawSize, drawSize);
            // Apply tint overlay
            if (tint) {
                this.ctx.globalAlpha = 0.45;
                this.ctx.fillStyle = tint;
                this.ctx.fillRect(offsetX, offsetY, drawSize, drawSize);
                this.ctx.globalAlpha = 1;
            }
        } else {
            // Fallback circle
            const radio = (this.cellSize * scale) / 2;
            this.ctx.fillStyle = entidad.getColor();
            this.ctx.beginPath();
            this.ctx.arc(xPx + this.cellSize / 2, yPx + this.cellSize / 2, radio * 0.8, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = 'white';
            this.ctx.font = `bold ${this.cellSize * 0.7 * scale}px 'Outfit', Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(entidad.getSimbolo(), xPx + this.cellSize / 2, yPx + this.cellSize / 2);
        }

        this.ctx.restore();
    }

    public obtenerCaptura(entidades: Entidad[]): string[][] {
        const captura: string[][] = Array.from(
            { length: this.alto },
            () => Array(this.ancho).fill('')
        );

        for (const e of entidades) {
            const x = e.getX();
            const y = e.getY();
            if (x >= 0 && x < this.ancho && y >= 0 && y < this.alto) {
                const nombreTipo = e.constructor.name;
                if (captura[y][x] === '' || captura[y][x] !== 'Obstaculo') {
                    captura[y][x] = nombreTipo;
                }
            }
        }
        return captura;
    }
}

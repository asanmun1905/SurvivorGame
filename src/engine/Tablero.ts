import { Entidad } from '../entities/Entidad';

/**
 * Clase responsable del renderizado visual y de la gestión lógica de la rejilla del tablero.
 */
export class Tablero {
    private ancho: number;
    private alto: number;
    private ctx: CanvasRenderingContext2D | null = null;
    private cellSize: number = 20;
    private assets: Map<string, HTMLImageElement> = new Map();
    private backgroundLoaded: boolean = false;

    /**
     * Inicializa un Tablero lógico.
     * 
     * @param ancho - Cantidad de celdas horizontales.
     * @param alto - Cantidad de celdas verticales.
     */
    constructor(ancho: number, alto: number) {
        this.ancho = ancho;
        this.alto = alto;
        this.cargarAssets();
    }

    /**
     * Carga las imágenes necesarias para el juego.
     */
    private cargarAssets(): void {
        const paths: Record<string, string> = {
            'background': '/assets/Background/background.png',
            'malo': '/assets/MaloMelee/NightBorne.png',
            'malo2': '/assets/MaloRango/Necromancer_creativekind-Sheet.png',
            'bueno': '/assets/BuenoMelee/Sprites/IDLE/idle_down.png',
            'obstaculo': '/assets/Obstacle/82cfbcc1-c0ad-4c07-91ae-ca682d039cb1_unnamed_1_.jpg'
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

    /**
     * Reconfigura las dimensiones del tablero.
     */
    public resetDimensiones(ancho: number, alto: number): void {
        this.ancho = ancho;
        this.alto = alto;
    }

    /**
     * Vincula el contexto del Canvas para permitir el dibujo.
     * 
     * @param ctx - El contexto 2D del elemento Canvas.
     * @param cellSize - El tamaño en píxeles de cada celda del juego.
     */
    public setContext(ctx: CanvasRenderingContext2D, cellSize: number): void {
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    /** @returns Ancho del tablero en celdas */
    public getAncho(): number {
        return this.ancho;
    }

    /** @returns Alto del tablero en celdas */
    public getAlto(): number {
        return this.alto;
    }

    /**
     * Limpia el canvas y dibuja todas las entidades actuales, junto con una rejilla de fondo.
     * 
     * @param entidades - Lista de entidades a renderizar.
     */
    public dibujar(entidades: Entidad[]): void {
        if (!this.ctx) {
            return;
        }

        const canvas = this.ctx.canvas;

        // 1. Limpiar el fondo
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Dibujar fondo (Imagen o Gradiente Oscuro)
        const bgImg = this.assets.get('background');
        if (this.backgroundLoaded && bgImg) {
            this.ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
            this.ctx.fillStyle = "#0f172a";
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Dibujar cada entidad
        for (const entidad of entidades) {
            this.dibujarEntidad(entidad);
        }
    }


    private dibujarEntidad(entidad: Entidad): void {
        if (!this.ctx) return;

        const xPx = entidad.getX() * this.cellSize;
        const yPx = entidad.getY() * this.cellSize;
        const assetKey = entidad.getAssetKey();
        const assetImg = this.assets.get(assetKey);

        this.ctx.save();

        // Efecto de profundidad / sombra
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        this.ctx.shadowOffsetY = 2;

        if (assetImg && assetImg.complete) {
            // Dibujar Sprite
            this.ctx.drawImage(assetImg, xPx, yPx, this.cellSize, this.cellSize);
        } else {
            // Fallback a dibujo vectorial original
            const radio = this.cellSize / 2;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = entidad.getColor();
            this.ctx.fillStyle = entidad.getColor();
            this.ctx.beginPath();
            this.ctx.arc(xPx + radio, yPx + radio, radio * 0.8, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = "white";
            this.ctx.font = `bold ${this.cellSize * 0.7}px 'Outfit', Arial`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(entidad.getSimbolo(), xPx + radio, yPx + radio);
        }

        this.ctx.restore();
    }

    /**
     * Genera una matriz de strings que representa el estado de ocupación del tablero.
     * Útil para que la IA decida sus movimientos sin pisar otras entidades.
     * 
     * @param entidades - Lista de entidades presentes.
     * @returns Matriz de nombres de clase de las entidades.
     */
    public obtenerCaptura(entidades: Entidad[]): string[][] {
        // Inicializamos matriz vacía
        const captura: string[][] = Array.from(
            { length: this.alto },
            () => Array(this.ancho).fill("")
        );

        for (const e of entidades) {
            const x = e.getX();
            const y = e.getY();

            // Verificamos límites preventivamente
            if (x >= 0 && x < this.ancho && y >= 0 && y < this.alto) {
                const nombreTipo = e.constructor.name;

                // Prioridad: Los obstáculos son permanentes
                if (captura[y][x] === "" || captura[y][x] !== "Obstaculo") {
                    captura[y][x] = nombreTipo;
                }
            }
        }
        return captura;
    }
}

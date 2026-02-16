import { Entidad } from '../entities/Entidad';

/**
 * Clase responsable del renderizado visual y de la gestión lógica de la rejilla del tablero.
 */
export class Tablero {
    private ancho: number;
    private alto: number;
    private ctx: CanvasRenderingContext2D | null = null;
    private cellSize: number = 20;

    /**
     * Inicializa un Tablero lógico.
     * 
     * @param ancho - Cantidad de celdas horizontales.
     * @param alto - Cantidad de celdas verticales.
     */
    constructor(ancho: number, alto: number) {
        this.ancho = ancho;
        this.alto = alto;
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

        // 2. Dibujar la cuadrícula decorativa
        this.dibujarCuadricula();

        // 3. Dibujar cada entidad
        for (const entidad of entidades) {
            this.dibujarEntidad(entidad);
        }
    }

    /**
     * Dibuja las líneas de la cuadrícula para ayudar a la visualización.
     */
    private dibujarCuadricula(): void {
        if (!this.ctx) return;

        this.ctx.strokeStyle = "#1e293b"; // Color de línea suave
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.ancho; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.alto * this.cellSize);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.alto; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.ancho * this.cellSize, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    /**
     * Renderiza una entidad individual como un círculo coloreado con un símbolo central.
     */
    private dibujarEntidad(entidad: Entidad): void {
        if (!this.ctx) return;

        const xPx = entidad.getX() * this.cellSize;
        const yPx = entidad.getY() * this.cellSize;
        const radio = this.cellSize / 2;

        // 1. Configurar efectos visuales Premium (Bloom/Glow)
        this.ctx.save();
        
        // Sombra brillante para el efecto de luz emitidda
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = entidad.getColor();
        
        // 2. Fondo de la entidad
        this.ctx.fillStyle = entidad.getColor();
        this.ctx.beginPath();
        this.ctx.arc(xPx + radio, yPx + radio, radio * 0.8, 0, Math.PI * 2);
        this.ctx.fill();

        // 3. Símbolo de la entidad (con contraste)
        this.ctx.shadowBlur = 0; // Desactivar glow para el texto
        this.ctx.fillStyle = "white";
        this.ctx.font = `bold ${this.cellSize * 0.7}px 'Outfit', Arial`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(entidad.getSimbolo(), xPx + radio, yPx + radio);

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

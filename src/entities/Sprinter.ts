import { Jugador } from './Jugador';
import { MovimientoInteligente } from '../logic/MovimientoInteligente';

/**
 * SPRINTER — Bestia ágil y frágil.
 * Vitalidad: 15–30. Se mueve 2 celdas por turno.
 * Visualmente más pequeña y cyan.
 */
export class Sprinter extends Jugador {
    constructor(x: number, y: number) {
        super(x, y, 'S', '#06b6d4', 'malo2'); // Cyan tint on malo2 sprite
        const vitalidad = Math.floor(Math.random() * 16) + 15; // 15-30
        this.setVitalidad(vitalidad);
        this.moveSpeed = 2;
        this.setEstrategia(new MovimientoInteligente());
    }

    /**
     * Overrides Jugador.mover() to move 2 cells per turn by calling the
     * strategy twice with an updated board snapshot.
     */
    public override mover(tablero: string[][]): void {
        if (!this.estrategia) return;

        // Move 1
        const pos1 = this.estrategia.siguienteMovimiento(this, tablero);
        // Update tablero snapshot for second move
        if (pos1.getX() !== this.getX() || pos1.getY() !== this.getY()) {
            const oldX = this.getX();
            const oldY = this.getY();
            this.posicion.setX(pos1.getX());
            this.posicion.setY(pos1.getY());
            this.renderX = oldX;
            this.renderY = oldY;
            tablero[oldY][oldX] = '';
            tablero[pos1.getY()][pos1.getX()] = this.constructor.name;
        }

        // Move 2 (second step)
        const pos2 = this.estrategia.siguienteMovimiento(this, tablero);
        this.posicion.setX(pos2.getX());
        this.posicion.setY(pos2.getY());
    }

    public override getVisualScale(): number {
        return 0.75; // Drawn 25% smaller
    }

    public override getTint(): string | null {
        return 'rgba(0, 200, 220, 0.3)'; // Cyan overlay
    }
}

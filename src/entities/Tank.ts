import { Jugador } from './Jugador';
import { MovimientoInteligente } from '../logic/MovimientoInteligente';

/**
 * TANK — Bestia de alta resistencia.
 * Vitalidad: 200–300. Se mueve cada 2 turnos (muy lento).
 * Visualmente más grande y oscuro que las bestias normales.
 */
export class Tank extends Jugador {
    private skipCounter: number = 0;

    constructor(x: number, y: number) {
        super(x, y, 'T', '#7c3aed', 'malo'); // Purple tint on malo sprite
        const vitalidad = Math.floor(Math.random() * 101) + 200; // 200-300
        this.setVitalidad(vitalidad);
        this.moveSpeed = 0.5;
        this.setEstrategia(new MovimientoInteligente());
    }

    public override shouldSkipTurn(): boolean {
        this.skipCounter++;
        if (this.skipCounter % 2 !== 0) {
            return true; // Skip every other turn
        }
        return false;
    }

    public override getVisualScale(): number {
        return 1.25; // Drawn 25% larger
    }

    public override getTint(): string | null {
        return 'rgba(80, 0, 120, 0.35)'; // Purple dark overlay
    }
}

import { Jugador } from './Jugador';
import { MovimientoInteligente } from '../logic/MovimientoInteligente';

/**
 * BOSS — Entidad suprema para la simulación.
 * Muy alta vitalidad y escala visual.
 */
export class BossEntity extends Jugador {
    constructor(x: number, y: number) {
        super(x, y, 'B', '#ef4444', 'boss');
        this.setVitalidad(2000);
        this.moveSpeed = 1.0;
        this.setEstrategia(new MovimientoInteligente());
    }

    public override getVisualScale(): number {
        return 1.6;
    }

    public override getTint(): string | null {
        return null; // Boss sprite is already distinct
    }
}

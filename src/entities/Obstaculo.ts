import { Entidad } from './Entidad';

/**
 * Representa un obstáculo estático en el tablero.
 * No puede moverse y bloquea el paso de cualquier otra entidad.
 */
export class Obstaculo extends Entidad {
    /**
     * Crea un nuevo Obstáculo.
     * Tiene una vitalidad muy alta para representar su naturaleza inamovible.
     * 
     * @param x - Posición X inicial.
     * @param y - Posición Y inicial.
     */
    constructor(x: number, y: number) {
        // "#" en gris para representar una roca o pared
        super(x, y, "#", "#aaaaaa", "obstaculo");

        // Vitalidad fija alta para que no sea derrotado en combate (aunque la lógica de combate lo ignora)
        this.setVitalidad(100);
    }
}

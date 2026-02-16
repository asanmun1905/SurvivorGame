import { Jugador } from './Jugador';

/**
 * Representa a una Presa en el juego Survivor.
 * Las presas intentan huir de los enemigos cercanos para sobrevivir.
 */
export class Presa extends Jugador {
    /**
     * Crea una nueva Presa.
     * Inicializa su vitalidad aleatoriamente entre 30 y 90.
     * 
     * @param x - Posición X inicial.
     * @param y - Posición Y inicial.
     */
    constructor(x: number, y: number) {
        // "P" en verde para representar a la presa/naturaleza
        super(x, y, "P", "#55ff55");
        
        // Vitalidad aleatoria: Math.random() * 61 [0..60] + 30 => [30..90]
        const vitalidadAleatoria = Math.floor(Math.random() * 61) + 30;
        this.setVitalidad(vitalidadAleatoria);
    }
}

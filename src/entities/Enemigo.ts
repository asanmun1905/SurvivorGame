import { Jugador } from './Jugador';

/**
 * Representa a un Enemigo en el juego Survivor.
 * Los enemigos suelen perseguir a las presas y tienen una vitalidad inicial media/alta.
 */
export class Enemigo extends Jugador {
    /**
     * Crea un nuevo Enemigo.
     * Inicializa su vitalidad aleatoriamente entre 50 y 90.
     * 
     * @param x - Posición X inicial.
     * @param y - Posición Y inicial.
     */
    constructor(x: number, y: number) {
        // "E" en rojo para representar el peligro
        const asset = Math.random() > 0.5 ? "malo" : "malo2";
        super(x, y, "E", "#ff5555", asset);

        // Vitalidad aleatoria: Math.random() * 41 [0..40] + 50 => [50..90]
        const vitalidadAleatoria = Math.floor(Math.random() * 41) + 50;
        this.setVitalidad(vitalidadAleatoria);
    }
}

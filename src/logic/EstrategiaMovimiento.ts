import { Entidad } from '../entities/Entidad';
import { Posicion } from '../utils/Posicion';

export interface EstrategiaMovimiento {
    /**
     * Determina el siguiente movimiento de una entidad.
     * @param entidad Entidad que se mueve.
     * @param tablero Estado visual del tablero.
     * @returns La nueva posición deseada.
     */
    siguienteMovimiento(entidad: Entidad, tablero: string[][]): Posicion;
}

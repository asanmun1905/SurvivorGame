import { Entidad } from './Entidad';
import type { EstrategiaMovimiento } from '../logic/EstrategiaMovimiento';

/**
 * Clase que extiende de Entidad para añadir capacidades de movimiento autónomo.
 * Utiliza el patrón Estrategia para delegar la decisión del próximo movimiento.
 */
export class Jugador extends Entidad {
    /** La estrategia que define cómo se mueve este jugador (huir, perseguir, etc.) */
    protected estrategia: EstrategiaMovimiento | null = null;

    /**
     * Inicializa un nuevo Jugador.
     * 
     * @param x - Posición inicial X.
     * @param y - Posición inicial Y.
     * @param simbolo - Carácter visual.
     * @param color - Color visual.
     */
    constructor(x: number, y: number, simbolo: string, color: string) {
        super(x, y, simbolo, color);
    }

    /**
     * Asigna una estrategia de movimiento al jugador.
     * 
     * @param estrategia - La implementación de EstrategiaMovimiento a usar.
     */
    public setEstrategia(estrategia: EstrategiaMovimiento): void {
        this.estrategia = estrategia;
    }

    /**
     * Obtiene la estrategia de movimiento actual.
     * 
     * @returns La estrategia configurada o null si no tiene ninguna.
     */
    public getEstrategia(): EstrategiaMovimiento | null {
        return this.estrategia;
    }

    /**
     * Ejecuta el movimiento del jugador basado en su estrategia actual.
     * Calcula la siguiente posición y actualiza las coordenadas del jugador.
     * 
     * @param tablero - Representación de la ocupación actual del tablero para evitar colisiones.
     */
    public mover(tablero: string[][]): void {
        if (!this.estrategia) {
            return;
        }

        const siguientePosicion = this.estrategia.siguienteMovimiento(this, tablero);
        
        // Actualizamos las coordenadas internas
        this.posicion.setX(siguientePosicion.getX());
        this.posicion.setY(siguientePosicion.getY());
    }
}

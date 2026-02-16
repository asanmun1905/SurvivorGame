import { Entidad } from '../entities/Entidad';
import { Enemigo } from '../entities/Enemigo';
import { Presa } from '../entities/Presa';
import { Posicion } from '../utils/Posicion';
import type { EstrategiaMovimiento } from './EstrategiaMovimiento';

/**
 * Estrategia de movimiento "Inteligente".
 * Los enemigos se mueven hacia el objetivo para minimizar la distancia Manhattan.
 * Las presas se mueven lejos del objetivo para maximizar la distancia Manhattan.
 */
export class MovimientoInteligente implements EstrategiaMovimiento {
    /** La entidad hacia la que se dirige o de la que huye esta IA */
    private objetivo: Entidad | null = null;
    
    /** Desplazamientos posibles en el eje Y (incluyendo diagonal y centro) */
    private static readonly dY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
    
    /** Desplazamientos posibles en el eje X (incluyendo diagonal y centro) */
    private static readonly dX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

    /**
     * Establece el objetivo de esta estrategia.
     * @param objetivo - La entidad objetivo (presa para el enemigo, enemigo para la presa).
     */
    public setObjetivo(objetivo: Entidad | null): void {
        this.objetivo = objetivo;
    }

    /**
     * Calcula la mejor posición adyacente basada en la distancia al objetivo.
     * 
     * @param entidad - La entidad que está realizando el movimiento.
     * @param tablero - Matriz indicando qué hay en cada coordenada para evitar obstáculos.
     * @returns La nueva Posicion decidida por la IA.
     */
    public siguienteMovimiento(entidad: Entidad, tablero: string[][]): Posicion {
        // Si no hay objetivo, nos quedamos donde estamos
        if (!this.objetivo) {
            return entidad.getPosicion().clone();
        }

        let mejorMovimiento = entidad.getPosicion().clone();
        
        // El enemigo busca la distancia mínima (infinito inicial), la presa busca la máxima (0 inicial)
        let mejorDistancia = (entidad instanceof Enemigo) ? Infinity : 0;

        const altoTablero = tablero.length;
        const anchoTablero = tablero[0].length;

        // Evaluamos las 9 posibles posiciones (8 direcciones + quedarse quieto)
        for (let i = 0; i < 9; i++) {
            const nuevoX = entidad.getX() + MovimientoInteligente.dX[i];
            const nuevoY = entidad.getY() + MovimientoInteligente.dY[i];

            // 1. Verificamos que esté dentro de los límites del tablero
            if (nuevoX >= 0 && nuevoX < anchoTablero && nuevoY >= 0 && nuevoY < altoTablero) {
                const contenidoCelda = tablero[nuevoY][nuevoX];
                
                // 2. Verificamos si la celda está bloqueada
                let bloqueado = false;
                if (contenidoCelda) {
                    if (contenidoCelda === "Obstaculo") {
                        bloqueado = true;
                    } else if (entidad instanceof Enemigo && contenidoCelda === "Enemigo") {
                        // Un enemigo no puede pisar a otro enemigo
                        bloqueado = true;
                    } else if (entidad instanceof Presa && contenidoCelda === "Presa") {
                        // Una presa no puede pisar a otra presa
                        bloqueado = true;
                    }
                }

                // 3. Si no está bloqueado, evaluamos la bondad del movimiento
                if (!bloqueado) {
                    const posiblePosicion = new Posicion(nuevoX, nuevoY);
                    const distanciaAlObjetivo = Posicion.distanciaManhattan(posiblePosicion, this.objetivo.getPosicion());

                    if (entidad instanceof Enemigo) {
                        // Lógica de Persecución: buscar distancia mínima
                        // Si la distancia es igual, tiramos una moneda para cambiar (añade variabilidad)
                        if (distanciaAlObjetivo < mejorDistancia || (distanciaAlObjetivo === mejorDistancia && Math.random() < 0.3)) {
                            mejorDistancia = distanciaAlObjetivo;
                            mejorMovimiento = posiblePosicion;
                        }
                    } else {
                        // Lógica de Huida: buscar distancia máxima
                        if (distanciaAlObjetivo > mejorDistancia || (distanciaAlObjetivo === mejorDistancia && Math.random() < 0.3)) {
                            mejorDistancia = distanciaAlObjetivo;
                            mejorMovimiento = posiblePosicion;
                        }
                    }
                }
            }
        }

        return mejorMovimiento;
    }
}

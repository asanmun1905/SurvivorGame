/**
 * Representa una posición bidimensional en el tablero de juego (coordenadas X e Y).
 * Proporciona métodos para el cálculo de distancias y manipulación de coordenadas.
 */
export class Posicion {
    private x: number;
    private y: number;

    /**
     * Crea una nueva instancia de Posicion.
     * 
     * @param x - La coordenada horizontal (columna).
     * @param y - La coordenada vertical (fila).
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Obtiene la coordenada X de la posición.
     * 
     * @returns El valor de la coordenada X.
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Establece un nuevo valor para la coordenada X.
     * 
     * @param x - El nuevo valor para la coordenada X.
     */
    public setX(x: number): void {
        this.x = x;
    }

    /**
     * Obtiene la coordenada Y de la posición.
     * 
     * @returns El valor de la coordenada Y.
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Establece un nuevo valor para la coordenada Y.
     * 
     * @param y - El nuevo valor para la coordenada Y.
     */
    public setY(y: number): void {
        this.y = y;
    }

    /**
     * Calcula la distancia Manhattan entre dos posiciones.
     * Se define como la suma de las diferencias absolutas de sus coordenadas.
     * 
     * @param p1 - La primera posición.
     * @param p2 - La segunda posición.
     * @returns La distancia Manhattan resultante.
     */
    public static distanciaManhattan(p1: Posicion, p2: Posicion): number {
        const diffX = Math.abs(p1.getX() - p2.getX());
        const diffY = Math.abs(p1.getY() - p2.getY());
        return diffX + diffY;
    }

    /**
     * Calcula la distancia Euclídea (línea recta) entre dos posiciones.
     * 
     * @param p1 - La primera posición.
     * @param p2 - La segunda posición.
     * @returns La distancia Euclídea resultante.
     */
    public static distanciaEuclidea(p1: Posicion, p2: Posicion): number {
        const dx = p1.getX() - p2.getX();
        const dy = p1.getY() - p2.getY();
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Determina si esta posición es idéntica a otra posición proporcionada.
     * 
     * @param other - La posición con la que comparar.
     * @returns True si las coordenadas X e Y coinciden, false en caso contrario.
     */
    public equals(other: Posicion): boolean {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Crea una copia exacta de esta posición para evitar efectos secundarios por referencia.
     * 
     * @returns Una nueva instancia de Posicion con las mismas coordenadas.
     */
    public clone(): Posicion {
        return new Posicion(this.x, this.y);
    }
}

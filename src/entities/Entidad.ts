import { Posicion } from '../utils/Posicion';

/**
 * Clase base abstracta que representa cualquier objeto o personaje dentro del tablero de juego.
 * Define las propiedades comunes como posición, representación visual y vitalidad.
 */
export abstract class Entidad {
    /** La posición actual de la entidad en el tablero */
    protected posicion: Posicion;

    /** El símbolo (letra o carácter) que representa a la entidad visualmente */
    protected simbolo: string;

    /** El color (en formato CSS/Hexadecimal) que se usará para renderizar la entidad */
    protected color: string;

    /** El identificador del asset visual que representa a esta entidad */
    protected assetKey: string;

    /** El nivel de salud o fuerza de la entidad. Se usa en la resolución de combates */
    protected vitalidad: number = 0;

    /**
     * Inicializa una nueva instancia de una Entidad.
     * 
     * @param x - Posición inicial en el eje X.
     * @param y - Posición inicial en el eje Y.
     * @param simbolo - Carácter que representa a la entidad.
     * @param color - Código de color para el renderizado.
     * @param assetKey - Identificador del asset para el renderizado visual.
     */
    constructor(x: number, y: number, simbolo: string, color: string, assetKey: string = '') {
        this.posicion = new Posicion(x, y);
        this.simbolo = simbolo;
        this.color = color;
        this.assetKey = assetKey;
    }

    /**
     * Obtiene el objeto de posición de la entidad.
     * @returns La instancia de Posicion.
     */
    public getPosicion(): Posicion {
        return this.posicion;
    }

    /**
     * Helper para obtener la coordenada X directamente.
     * @returns Coordenada X.
     */
    public getX(): number {
        return this.posicion.getX();
    }

    /**
     * Helper para obtener la coordenada Y directamente.
     * @returns Coordenada Y.
     */
    public getY(): number {
        return this.posicion.getY();
    }

    /**
     * Obtiene la vitalidad actual de la entidad.
     * @returns Valor de vitalidad.
     */
    public getVitalidad(): number {
        return this.vitalidad;
    }

    /**
     * Actualiza la vitalidad de la entidad.
     * @param vitalidad - El nuevo valor de vitalidad.
     */
    public setVitalidad(vitalidad: number): void {
        this.vitalidad = vitalidad;
    }

    /**
     * Obtiene el símbolo representativo de la entidad.
     * @returns El string con el símbolo.
     */
    public getSimbolo(): string {
        return this.simbolo;
    }

    /**
     * Obtiene el color de la entidad.
     * @returns El string con el color CSS.
     */
    public getColor(): string {
        return this.color;
    }

    /**
     * Obtiene el identificador del asset de la entidad.
     * @returns El string con la clave del asset.
     */
    public getAssetKey(): string {
        return this.assetKey;
    }

    /**
     * Devuelve una representación textual simplificada de la entidad.
     * @returns El símbolo de la entidad.
     */
    public toString(): string {
        return this.simbolo;
    }
}

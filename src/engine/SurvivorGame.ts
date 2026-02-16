import { Entidad } from '../entities/Entidad';
import { Enemigo } from '../entities/Enemigo';
import { Presa } from '../entities/Presa';
import { Obstaculo } from '../entities/Obstaculo';
import { Tablero } from './Tablero';
import { Posicion } from '../utils/Posicion';
import { MovimientoInteligente } from '../logic/MovimientoInteligente';

/**
 * Motor principal del juego Survivor.
 * Gestiona el ciclo de vida de las entidades, los turnos y la resolución de conflictos.
 */
export class SurvivorGame {
    private tablero: Tablero;
    private entidades: Entidad[] = [];
    private enemigos: Enemigo[] = [];
    private presas: Presa[] = [];
    
    private running: boolean = false;
    private turnDelay: number = 100; // Milisegundos entre turnos

    /**
     * Crea una nueva partida.
     * 
     * @param ancho - Columnas del tablero.
     * @param alto - Filas del tablero.
     */
    constructor(ancho: number, alto: number) {
        this.tablero = new Tablero(ancho, alto);
    }

    /**
     * Ajusta la velocidad de la simulación.
     * @param delay - Milisegundos de espera entre turnos.
     */
    public setVelocidad(delay: number): void {
        this.turnDelay = delay;
    }

    /** @returns El gestor del tablero */
    public getTablero(): Tablero { 
        return this.tablero; 
    }

    /** @returns Lista de todas las entidades activas */
    public getEntidades(): Entidad[] {
        return this.entidades;
    }

    /** @returns Cantidad de presas vivas */
    public getContadorPresas(): number {
        return this.presas.length;
    }

    /** @returns Cantidad de enemigos vivos */
    public getContadorEnemigos(): number {
        return this.enemigos.length;
    }

    /**
     * Inicializa el mundo de juego con una cantidad configurada de elementos.
     * 
     * @param numObstaculos - Cantidad de paredes/rocas.
     * @param numEnemigos - Cantidad de cazadores.
     * @param numPresas - Cantidad de fugitivos.
     */
    public iniciar(numObstaculos: number, numEnemigos: number, numPresas: number): void {
        this.entidades = [];
        this.enemigos = [];
        this.presas = [];
        
        this.generarObstaculos(numObstaculos);
        this.generarEnemigos(numEnemigos);
        this.generarPresas(numPresas);
    }

    /**
     * Crea obstáculos en posiciones aleatorias libres.
     */
    private generarObstaculos(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const obs = new Obstaculo(pos.getX(), pos.getY());
            this.entidades.push(obs);
        }
    }

    /**
     * Crea enemigos con estrategia inteligente.
     */
    private generarEnemigos(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const enemigo = new Enemigo(pos.getX(), pos.getY());
            
            const estrategia = new MovimientoInteligente();
            enemigo.setEstrategia(estrategia);
            
            this.enemigos.push(enemigo);
            this.entidades.push(enemigo);
        }
    }

    /**
     * Crea presas con estrategia inteligente.
     */
    private generarPresas(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const presa = new Presa(pos.getX(), pos.getY());
            
            const estrategia = new MovimientoInteligente();
            presa.setEstrategia(estrategia);
            
            this.presas.push(presa);
            this.entidades.push(presa);
        }
    }

    /**
     * Busca una coordenada aleatoria que no esté ocupada por ninguna entidad.
     */
    private obtenerPosicionVacia(): Posicion {
        let x: number, y: number, ocupada: boolean;
        
        do {
            x = Math.floor(Math.random() * this.tablero.getAncho());
            y = Math.floor(Math.random() * this.tablero.getAlto());
            
            // Verificamos si algún elemento ya está en esa casilla
            ocupada = this.entidades.some(e => e.getX() === x && e.getY() === y);
            
        } while (ocupada);
        
        return new Posicion(x, y);
    }

    /**
     * Procesa un turno completo de juego.
     * Actualiza posiciones y resuelve combates.
     */
    public actualizar(): void {
        const capturaTablero = this.tablero.obtenerCaptura(this.entidades);
        const enemigosAEliminar: Enemigo[] = [];
        const presasAEliminar: Presa[] = [];

        // 1. Fase de Enemigos: Persiguen a las presas
        for (const enemigo of this.enemigos) {
            const presaMasCercana = this.buscarPresaCercana(enemigo);
            
            if (presaMasCercana) {
                const est = enemigo.getEstrategia() as MovimientoInteligente;
                est.setObjetivo(presaMasCercana);

                const oldX = enemigo.getX();
                const oldY = enemigo.getY();
                
                enemigo.mover(capturaTablero);

                // Actualizamos la captura para que otros no pisen esta celda en el mismo turno
                capturaTablero[oldY][oldX] = "";
                capturaTablero[enemigo.getY()][enemigo.getX()] = "Enemigo";

                // Resolución de encuentro (combate)
                if (enemigo.getX() === presaMasCercana.getX() && enemigo.getY() === presaMasCercana.getY()) {
                    this.resolverCombate(enemigo, presaMasCercana, presasAEliminar, enemigosAEliminar, capturaTablero);
                }
            }
        }

        // 2. Fase de Presas: Huyen de los enemigos
        for (const presa of this.presas) {
            // Si la presa ya va a ser eliminada este turno, no se mueve
            if (presasAEliminar.includes(presa)) continue;

            const enemigoMasCercano = this.buscarEnemigoCercano(presa);
            if (enemigoMasCercano) {
                const est = presa.getEstrategia() as MovimientoInteligente;
                est.setObjetivo(enemigoMasCercano);

                const oldX = presa.getX();
                const oldY = presa.getY();
                
                presa.mover(capturaTablero);

                capturaTablero[oldY][oldX] = "";
                capturaTablero[presa.getY()][presa.getX()] = "Presa";

                // Combate si la presa choca accidentalmente con un enemigo
                if (presa.getX() === enemigoMasCercano.getX() && presa.getY() === enemigoMasCercano.getY()) {
                    this.resolverCombate(enemigoMasCercano, presa, presasAEliminar, enemigosAEliminar, capturaTablero);
                }
            }
        }

        // 3. Fase de limpieza: Eliminar caídos
        this.limpiarEntidades(presasAEliminar, enemigosAEliminar);
    }

    /**
     * Compara vitalidades y decide quién sobrevive a un encuentro.
     */
    private resolverCombate(
        enemigo: Enemigo, 
        presa: Presa, 
        presasAEliminar: Presa[], 
        enemigosAEliminar: Enemigo[],
        captura: string[][]
    ): void {
        if (enemigo.getVitalidad() >= presa.getVitalidad()) {
            // El enemigo gana
            presasAEliminar.push(presa);
            captura[enemigo.getY()][enemigo.getX()] = "Enemigo";
        } else {
            // La presa es sorprendentemente más fuerte (defensa exitosa)
            enemigosAEliminar.push(enemigo);
            captura[enemigo.getY()][enemigo.getX()] = "Presa";
        }
    }

    /**
     * Elimina físicamente las entidades de los arrays de seguimiento.
     */
    private limpiarEntidades(presasAEliminar: Presa[], enemigosAEliminar: Enemigo[]): void {
        for (const p of presasAEliminar) {
            this.presas = this.presas.filter(pr => pr !== p);
            this.entidades = this.entidades.filter(ent => ent !== p);
        }
        for (const e of enemigosAEliminar) {
            this.enemigos = this.enemigos.filter(en => en !== e);
            this.entidades = this.entidades.filter(ent => ent !== e);
        }
    }

    /** Algoritmo de búsqueda de vecino más cercano para el enemigo */
    private buscarPresaCercana(e: Enemigo): Presa | null {
        let cercana: Presa | null = null;
        let minDist = Infinity;
        
        for (const p of this.presas) {
            const d = Posicion.distanciaEuclidea(e.getPosicion(), p.getPosicion());
            if (d < minDist) {
                minDist = d;
                cercana = p;
            }
        }
        return cercana;
    }

    /** Algoritmo de búsqueda de amenaza más cercana para la presa */
    private buscarEnemigoCercano(p: Presa): Enemigo | null {
        let cercano: Enemigo | null = null;
        let minDist = Infinity;
        
        for (const e of this.enemigos) {
            const d = Posicion.distanciaEuclidea(p.getPosicion(), e.getPosicion());
            if (d < minDist) {
                minDist = d;
                cercano = e;
            }
        }
        return cercano;
    }

    /**
     * Inicia el bucle de animación del juego.
     * 
     * @param onUpdate - Callback ejecutado en cada paso para actualizar la UI externa.
     * @returns Una promesa que se resuelve con el mensaje de fin de juego.
     */
    public async ejecutar(onUpdate: () => void): Promise<string> {
        this.running = true;
        
        while (this.running && this.presas.length > 0 && this.enemigos.length > 0) {
            this.actualizar();
            onUpdate();
            
            // Pausa controlada para la animación
            await new Promise(resolve => setTimeout(resolve, this.turnDelay));
        }
        
        this.running = false;
        
        if (this.presas.length === 0) {
            return "PARTIDA FINALIZADA: Los cazadores han triunfado.";
        } else {
            return "VICTORIA TOTAL: La naturaleza ha derrotado a la amenaza.";
        }
    }

    /**
     * Detiene el juego inmediatamente.
     */
    public stop(): void {
        this.running = false;
    }
}

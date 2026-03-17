import { Entidad } from '../entities/Entidad';
import { Enemigo } from '../entities/Enemigo';
import { Presa } from '../entities/Presa';
import { Obstaculo } from '../entities/Obstaculo';
import { Tank } from '../entities/Tank';
import { Sprinter } from '../entities/Sprinter';
import { Tablero } from './Tablero';
import { Posicion } from '../utils/Posicion';
import { MovimientoInteligente } from '../logic/MovimientoInteligente';
import { BossEntity } from '../entities/BossEntity';

export class SurvivorGame {
    private tablero: Tablero;
    private entidades: Entidad[] = [];
    private enemigos: (Enemigo | Tank | Sprinter)[] = [];
    private presas: Presa[] = [];

    private running: boolean = false;
    private turnDelay: number = 100;

    constructor(ancho: number, alto: number) {
        this.tablero = new Tablero(ancho, alto);
    }

    public setVelocidad(delay: number): void { this.turnDelay = delay; }
    public getTablero(): Tablero { return this.tablero; }
    public getEntidades(): Entidad[] { return this.entidades; }
    public getContadorPresas(): number { return this.presas.length; }
    public getContadorEnemigos(): number { return this.enemigos.length; }

    /**
     * Inicializa el mundo con entidades.
     * @param numObstaculos
     * @param numEnemigos     — Bestias normales
     * @param numPresas       — Cazadores
     * @param numTanks        — Bestias lentas de alta salud
     * @param numSprinters    — Bestias rápidas de baja salud
     */
    public iniciar(
        numObstaculos: number,
        numEnemigos: number,
        numPresas: number,
        numTanks: number = 0,
        numSprinters: number = 0
    ): void {
        this.entidades = [];
        this.enemigos = [];
        this.presas = [];

        this.generarObstaculos(numObstaculos);
        this.generarEnemigos(numEnemigos);
        this.generarPresas(numPresas);
        this.generarTanks(numTanks);
        this.generarSprinters(numSprinters);
    }

    public clearEntityAt(x: number, y: number): void {
        const index = this.entidades.findIndex(e => e.getX() === x && e.getY() === y);
        if (index !== -1) {
            const ent = this.entidades[index];
            this.entidades.splice(index, 1);
            if (ent instanceof Enemigo || ent instanceof Tank || ent instanceof Sprinter || ent instanceof BossEntity) {
                this.enemigos = this.enemigos.filter(e => e !== ent);
            } else if (ent instanceof Presa) {
                this.presas = this.presas.filter(p => p !== ent);
            }
        }
    }

    public addEntityAt(type: 'Obstaculo' | 'Enemigo' | 'Presa' | 'Tank' | 'Sprinter' | 'Boss', x: number, y: number): void {
        this.clearEntityAt(x, y);
        if (x < 0 || x >= this.tablero.getAncho() || y < 0 || y >= this.tablero.getAlto()) return;

        if (type === 'Obstaculo') {
            this.entidades.push(new Obstaculo(x, y));
        } else if (type === 'Enemigo') {
            const e = new Enemigo(x, y);
            e.setEstrategia(new MovimientoInteligente());
            this.enemigos.push(e);
            this.entidades.push(e);
        } else if (type === 'Tank') {
            const t = new Tank(x, y);
            this.enemigos.push(t);
            this.entidades.push(t);
        } else if (type === 'Sprinter') {
            const s = new Sprinter(x, y);
            this.enemigos.push(s);
            this.entidades.push(s);
        } else if (type === 'Presa') {
            const p = new Presa(x, y);
            p.setEstrategia(new MovimientoInteligente());
            this.presas.push(p);
            this.entidades.push(p);
        } else if (type === 'Boss') {
            const b = new BossEntity(x, y);
            this.enemigos.push(b as any);
            this.entidades.push(b);
        }
    }

    // ─── Generators ────────────────────────────────────────────────

    private generarObstaculos(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            this.entidades.push(new Obstaculo(pos.getX(), pos.getY()));
        }
    }

    private generarEnemigos(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const e = new Enemigo(pos.getX(), pos.getY());
            e.setEstrategia(new MovimientoInteligente());
            this.enemigos.push(e);
            this.entidades.push(e);
        }
    }

    private generarPresas(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const p = new Presa(pos.getX(), pos.getY());
            p.setEstrategia(new MovimientoInteligente());
            this.presas.push(p);
            this.entidades.push(p);
        }
    }

    private generarTanks(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const t = new Tank(pos.getX(), pos.getY());
            this.enemigos.push(t);
            this.entidades.push(t);
        }
    }

    private generarSprinters(cantidad: number): void {
        for (let i = 0; i < cantidad; i++) {
            const pos = this.obtenerPosicionVacia();
            const s = new Sprinter(pos.getX(), pos.getY());
            this.enemigos.push(s);
            this.entidades.push(s);
        }
    }

    private obtenerPosicionVacia(): Posicion {
        let x: number, y: number, ocupada: boolean;
        do {
            x = Math.floor(Math.random() * this.tablero.getAncho());
            y = Math.floor(Math.random() * this.tablero.getAlto());
            ocupada = this.entidades.some(e => e.getX() === x && e.getY() === y);
        } while (ocupada);
        return new Posicion(x, y);
    }

    // ─── Game Loop ────────────────────────────────────────────────

    public actualizar(): void {
        const capturaTablero = this.tablero.obtenerCaptura(this.entidades);
        const enemigosAEliminar: (Enemigo | Tank | Sprinter)[] = [];
        const presasAEliminar: Presa[] = [];

        for (const enemigo of this.enemigos) {
            // Tank skips every other turn
            if (enemigo.shouldSkipTurn()) continue;

            const presaMasCercana = this.buscarPresaCercana(enemigo);
            if (!presaMasCercana) continue;

            const est = enemigo.getEstrategia() as MovimientoInteligente;
            est.setObjetivo(presaMasCercana);

            const oldX = enemigo.getX();
            const oldY = enemigo.getY();

            enemigo.mover(capturaTablero);

            capturaTablero[oldY][oldX] = '';
            capturaTablero[enemigo.getY()][enemigo.getX()] = enemigo.constructor.name;

            if (enemigo.getX() === presaMasCercana.getX() && enemigo.getY() === presaMasCercana.getY()) {
                this.resolverCombate(enemigo, presaMasCercana, presasAEliminar, enemigosAEliminar, capturaTablero);
            }
        }

        for (const presa of this.presas) {
            if (presasAEliminar.includes(presa)) continue;

            const enemigoMasCercano = this.buscarEnemigoCercano(presa);
            if (!enemigoMasCercano) continue;

            const est = presa.getEstrategia() as MovimientoInteligente;
            est.setObjetivo(enemigoMasCercano);

            const oldX = presa.getX();
            const oldY = presa.getY();
            presa.mover(capturaTablero);

            capturaTablero[oldY][oldX] = '';
            capturaTablero[presa.getY()][presa.getX()] = 'Presa';

            if (presa.getX() === enemigoMasCercano.getX() && presa.getY() === enemigoMasCercano.getY()) {
                this.resolverCombate(enemigoMasCercano, presa, presasAEliminar, enemigosAEliminar, capturaTablero);
            }
        }

        this.limpiarEntidades(presasAEliminar, enemigosAEliminar);
    }

    private resolverCombate(
        enemigo: Enemigo | Tank | Sprinter,
        presa: Presa,
        presasAEliminar: Presa[],
        enemigosAEliminar: (Enemigo | Tank | Sprinter)[],
        captura: string[][]
    ): void {
        if (enemigo.getVitalidad() >= presa.getVitalidad()) {
            presasAEliminar.push(presa);
            captura[enemigo.getY()][enemigo.getX()] = enemigo.constructor.name;
        } else {
            enemigosAEliminar.push(enemigo);
            captura[enemigo.getY()][enemigo.getX()] = 'Presa';
        }
    }

    private limpiarEntidades(presasAEliminar: Presa[], enemigosAEliminar: (Enemigo | Tank | Sprinter)[]): void {
        for (const p of presasAEliminar) {
            this.presas = this.presas.filter(pr => pr !== p);
            this.entidades = this.entidades.filter(ent => ent !== p);
        }
        for (const e of enemigosAEliminar) {
            this.enemigos = this.enemigos.filter(en => en !== e);
            this.entidades = this.entidades.filter(ent => ent !== e);
        }
    }

    // Returns how many enemies were eliminated this turn (for gold tracking)
    public actualizarConKills(): number {
        const prevCount = this.enemigos.length;
        this.actualizar();
        return Math.max(0, prevCount - this.enemigos.length);
    }

    private buscarPresaCercana(e: Enemigo | Tank | Sprinter): Presa | null {
        let cercana: Presa | null = null;
        let minDist = Infinity;
        for (const p of this.presas) {
            const d = Posicion.distanciaEuclidea(e.getPosicion(), p.getPosicion());
            if (d < minDist) { minDist = d; cercana = p; }
        }
        return cercana;
    }

    private buscarEnemigoCercano(p: Presa): (Enemigo | Tank | Sprinter) | null {
        let cercano: (Enemigo | Tank | Sprinter) | null = null;
        let minDist = Infinity;
        for (const e of this.enemigos) {
            const d = Posicion.distanciaEuclidea(p.getPosicion(), e.getPosicion());
            if (d < minDist) { minDist = d; cercano = e; }
        }
        return cercano;
    }

    public async ejecutar(onUpdate: () => void): Promise<string> {
        this.running = true;
        while (this.running && this.presas.length > 0 && this.enemigos.length > 0) {
            this.actualizar();
            onUpdate();
            await new Promise(resolve => setTimeout(resolve, this.turnDelay));
        }
        this.running = false;
        if (this.presas.length === 0) {
            return 'LA NOCHE HA CAÍDO, LAS BESTIAS HAN GANADO.';
        }
        return 'LA CAZA HA SIDO COMPLETADA.';
    }

    public stop(): void { this.running = false; }
}

/**
 * OleadasGame.ts — Wave Mode with functional economy and manual wave advancement.
 * Exposes addGold, spendGold, upgradeSpeed, upgradeCazadores, and nextWave().
 */

import { SurvivorGame } from './SurvivorGame';

export type Clase = 'guerrero' | 'arquero' | 'explorador';

export interface ClaseStats {
    nombre: string;
    emoji: string;
    descripcion: string;
    cazadores: number;
    velocidad: number;
}

export const CLASES: Record<Clase, ClaseStats> = {
    guerrero: {
        nombre: 'Guerrero', emoji: '⚔️',
        descripcion: 'Alta resistencia. Muchos cazadores, ritmo lento.',
        cazadores: 18, velocidad: 180
    },
    arquero: {
        nombre: 'Arquero', emoji: '🏹',
        descripcion: 'Pocos cazadores, muy veloces.',
        cazadores: 10, velocidad: 80
    },
    explorador: {
        nombre: 'Explorador', emoji: '🗺️',
        descripcion: 'Equilibrado entre número y velocidad.',
        cazadores: 14, velocidad: 130
    }
};

export type WaveResult = 'victory' | 'defeat';

export interface OleadasCallbacks {
    onOleadaChange: (n: number) => void;
    onOroChange: (n: number) => void;
    onPresasChange: (n: number) => void;
    onEnemigosChange: (n: number) => void;
    onWaveEnd: (result: WaveResult, oleada: number) => void;
}

export class OleadasGame {
    private game: SurvivorGame;
    private clase: ClaseStats;
    private callbacks: OleadasCallbacks;

    private oleadaActual: number = 0;
    private oro: number = 100;
    private running: boolean = false;

    // Mutable class upgrades
    private cazadoresBase: number;
    private velocidadBase: number;

    private ctx: CanvasRenderingContext2D;
    private cellSize: number;
    private ancho: number;
    private alto: number;

    constructor(
        ancho: number,
        alto: number,
        clase: Clase,
        ctx: CanvasRenderingContext2D,
        cellSize: number,
        callbacks: OleadasCallbacks
    ) {
        this.clase = CLASES[clase];
        this.cazadoresBase = this.clase.cazadores;
        this.velocidadBase = this.clase.velocidad;
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.ancho = ancho;
        this.alto = alto;
        this.callbacks = callbacks;

        this.game = new SurvivorGame(ancho, alto);
        this.game.getTablero().setContext(ctx, cellSize);
        this.game.setVelocidad(this.velocidadBase);
    }

    public getTablero() { return this.game.getTablero(); }
    public getOleada() { return this.oleadaActual; }
    public getOro() { return this.oro; }
    public getSurvivorGame() { return this.game; }

    // ─── Economy ───────────────────────────────────────────────────

    public addGold(amount: number): void {
        this.oro += amount;
        this.callbacks.onOroChange(this.oro);
    }

    public spendGold(cost: number): boolean {
        if (this.oro < cost) return false;
        this.oro -= cost;
        this.callbacks.onOroChange(this.oro);
        return true;
    }

    /**
     * Shop: +Speed (reduce delay, max 2x faster)
     */
    public upgradeSpeed(): boolean {
        const cost = 30;
        if (!this.spendGold(cost)) return false;
        this.velocidadBase = Math.max(40, Math.floor(this.velocidadBase * 0.75));
        this.game.setVelocidad(this.velocidadBase);
        return true;
    }

    /**
     * Shop: +5 Cazadores for next wave
     */
    public upgradeCazadores(): boolean {
        const cost = 40;
        if (!this.spendGold(cost)) return false;
        this.cazadoresBase += 5;
        return true;
    }

    // ─── Wave Management ───────────────────────────────────────────

    /**
     * Kicks off the very first wave. Only call once.
     */
    public async iniciar(): Promise<void> {
        this.running = true;
        await this.lanzarOleadaYEsperar();
    }

    /**
     * Called by the UI to advance to the next wave after wave-end overlay dismissed
     */
    public async nextWave(): Promise<void> {
        if (!this.running) return;
        await this.lanzarOleadaYEsperar();
    }

    private async lanzarOleadaYEsperar(): Promise<void> {
        if (!this.running) return;
        this.oleadaActual++;
        this.callbacks.onOleadaChange(this.oleadaActual);

        // Bestia counts scale per wave
        const numBestias = Math.floor(3 + this.oleadaActual * 2);
        const numTanks = Math.floor(this.oleadaActual / 3);
        const numSprinters = Math.floor(this.oleadaActual / 2);
        const numObstaculos = Math.min(40, 8 + this.oleadaActual * 2);

        // Reset game for new wave
        this.game.stop();
        await new Promise(r => setTimeout(r, 50));
        this.game = new SurvivorGame(this.ancho, this.alto);
        this.game.getTablero().setContext(this.ctx, this.cellSize);
        this.game.setVelocidad(this.velocidadBase);
        this.game.iniciar(numObstaculos, numBestias, this.cazadoresBase, numTanks, numSprinters);

        // Start the rAF smooth render loop
        this.game.getTablero().iniciarRenderLoop(() => this.game.getEntidades());

        this.callbacks.onPresasChange(this.cazadoresBase);
        this.callbacks.onEnemigosChange(numBestias + numTanks + numSprinters);

        const resultado = await this.game.ejecutar(() => {
            this.callbacks.onPresasChange(this.game.getContadorPresas());
            this.callbacks.onEnemigosChange(this.game.getContadorEnemigos());
        });

        this.game.getTablero().detenerRenderLoop();

        if (!this.running) return;

        const waveResult: WaveResult = resultado.includes('COMPLETADA') ? 'victory' : 'defeat';
        if (waveResult === 'victory') {
            const bonus = 50 + this.oleadaActual * 10;
            this.addGold(bonus);
        }

        this.callbacks.onWaveEnd(waveResult, this.oleadaActual);
    }

    public stop(): void {
        this.running = false;
        this.game.stop();
        this.game.getTablero().detenerRenderLoop();
    }
}

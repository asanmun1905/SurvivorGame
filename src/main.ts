import './style.css';
import { SurvivorGame } from './engine/SurvivorGame';

/**
 * ELEMENTOS DEL DOM
 */
const get = (id: string) => document.getElementById(id);

const DOM = {
    // Escenas
    mainMenu: get('main-menu') as HTMLElement,
    gameScreen: get('game-screen') as HTMLElement,
    settingsOverlay: get('settings-overlay') as HTMLElement,

    // Acciones Menu Principal
    btnStart: get('btn-start') as HTMLButtonElement,
    btnSettings: get('btn-settings') as HTMLButtonElement,

    // Acciones Settings
    btnCloseSettings: get('close-settings') as HTMLButtonElement,
    btnSaveSettings: get('save-settings') as HTMLButtonElement,

    // Acciones Game HUD
    btnBackToMenu: get('menu-back-btn') as HTMLButtonElement,

    // Acciones Overlay Resultados
    overlayRestartBtn: get('overlay-restart-btn') as HTMLElement,
    overlayMenuBtn: get('overlay-menu-btn') as HTMLElement,

    // Componentes del Juego
    canvas: get('game-canvas') as HTMLCanvasElement,
    turnCount: get('turn-count') as HTMLElement,
    presaCount: get('presa-count') as HTMLElement,
    enemigoCount: get('enemigo-count') as HTMLElement,
    statusOverlay: get('status-overlay') as HTMLElement,
    statusText: get('status-text') as HTMLElement,

    // Inputs Configuración
    inputAncho: get('input-ancho') as HTMLInputElement,
    inputAlto: get('input-alto') as HTMLInputElement,
    inputObstaculos: get('input-obstaculos') as HTMLInputElement,
    inputEnemigos: get('input-enemigos') as HTMLInputElement,
    inputPresas: get('input-presas') as HTMLInputElement,
    inputVelocidad: get('input-velocidad') as HTMLInputElement,
    valVelocidad: get('val-velocidad') as HTMLElement,

    // Ajustes Visuales
    selectTheme: get('select-theme') as HTMLSelectElement,
    inputBrightness: get('input-brightness') as HTMLInputElement
};

/**
 * ESTADO GLOBAL
 */
let turnosRealizados = 0;
const ctx = DOM.canvas ? DOM.canvas.getContext('2d') : null;

if (!ctx) {
    console.error('No se pudo inicializar el Canvas.');
}

let motorJuego: SurvivorGame | null = null;

/**
 * ACTUALIZACIÓN DE INTERFAZ
 */
function refrescarInterfaz(): void {
    if (!motorJuego) return;
    DOM.turnCount.textContent = turnosRealizados.toString();
    DOM.presaCount.textContent = motorJuego.getContadorPresas().toString();
    DOM.enemigoCount.textContent = motorJuego.getContadorEnemigos().toString();
}

/**
 * LÓGICA DE NAVEGACIÓN Y ARRANQUE
 */
async function arrancarPartida(): Promise<void> {
    if (!ctx) return;

    // 1. Swapping de Pantallas
    DOM.mainMenu.classList.add('hidden');
    DOM.settingsOverlay.classList.add('hidden');
    DOM.gameScreen.classList.remove('hidden');

    // 2. Parada de emergencia del loop anterior
    if (motorJuego) motorJuego.stop();
    await new Promise(resolve => setTimeout(resolve, 50));

    // 3. Captura de Parámetros
    const config = {
        ancho: Math.max(10, parseInt(DOM.inputAncho.value) || 10),
        alto: Math.max(10, parseInt(DOM.inputAlto.value) || 10),
        obstaculos: Math.max(0, parseInt(DOM.inputObstaculos.value) || 0),
        enemigos: Math.max(1, parseInt(DOM.inputEnemigos.value) || 1),
        presas: Math.max(1, parseInt(DOM.inputPresas.value) || 1),
        velocidad: parseInt(DOM.inputVelocidad.value)
    };

    // 4. Inicialización
    motorJuego = new SurvivorGame(config.ancho, config.alto);
    motorJuego.getTablero().setContext(ctx, 20);
    motorJuego.setVelocidad(config.velocidad);

    // Sync Dimensiones
    DOM.canvas.width = config.ancho * 20;
    DOM.canvas.height = config.alto * 20;

    // 5. Reset UI
    DOM.statusOverlay.classList.add('hidden');
    turnosRealizados = 0;

    // 6. Spawn
    motorJuego.iniciar(config.obstaculos, config.enemigos, config.presas);
    refrescarInterfaz();

    // 7. Loop
    const mensajeResultado = await motorJuego.ejecutar(() => {
        turnosRealizados++;
        if (motorJuego) {
            motorJuego.getTablero().dibujar(motorJuego.getEntidades());
            refrescarInterfaz();
        }
    });

    // 8. Game Over
    DOM.statusText.textContent = mensajeResultado;
    DOM.statusOverlay.classList.remove('hidden');
}

function irAlMenu() {
    if (motorJuego) motorJuego.stop();
    DOM.gameScreen.classList.add('hidden');
    DOM.statusOverlay.classList.add('hidden');
    DOM.mainMenu.classList.remove('hidden');
}

/**
 * ATADURA DE EVENTOS
 */
if (DOM.btnStart) DOM.btnStart.onclick = () => arrancarPartida();
if (DOM.btnSettings) DOM.btnSettings.onclick = () => DOM.settingsOverlay.classList.remove('hidden');
if (DOM.btnCloseSettings) DOM.btnCloseSettings.onclick = () => DOM.settingsOverlay.classList.add('hidden');
if (DOM.btnSaveSettings) DOM.btnSaveSettings.onclick = () => arrancarPartida();

if (DOM.btnBackToMenu) DOM.btnBackToMenu.onclick = irAlMenu;
if (DOM.overlayMenuBtn) DOM.overlayMenuBtn.onclick = irAlMenu;
if (DOM.overlayRestartBtn) DOM.overlayRestartBtn.onclick = () => arrancarPartida();

// Configuración en tiempo real
if (DOM.inputBrightness) {
    DOM.inputBrightness.oninput = () => {
        document.documentElement.style.setProperty('--brightness', DOM.inputBrightness.value);
    };
}

if (DOM.selectTheme) {
    DOM.selectTheme.onchange = () => {
        document.body.className = `theme-${DOM.selectTheme.value}`;
    };
}

if (DOM.inputVelocidad) {
    DOM.inputVelocidad.oninput = () => {
        DOM.valVelocidad.textContent = `${DOM.inputVelocidad.value}ms`;
        if (motorJuego) motorJuego.setVelocidad(parseInt(DOM.inputVelocidad.value));
    };
}

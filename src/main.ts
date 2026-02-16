import './style.css';
import { SurvivorGame } from './engine/SurvivorGame';

/**
 * ELEMENTOS DEL DOM
 */
const DOM = {
    canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
    turnCount: document.getElementById('turn-count') as HTMLElement,
    presaCount: document.getElementById('presa-count') as HTMLElement,
    enemigoCount: document.getElementById('enemigo-count') as HTMLElement,
    statusOverlay: document.getElementById('status-overlay') as HTMLElement,
    statusText: document.getElementById('status-text') as HTMLElement,
    restartBtn: document.getElementById('restart-btn') as HTMLElement,
    overlayRestartBtn: document.getElementById('overlay-restart-btn') as HTMLElement,
    
    // Inputs de configuración
    inputAncho: document.getElementById('input-ancho') as HTMLInputElement,
    inputAlto: document.getElementById('input-alto') as HTMLInputElement,
    inputObstaculos: document.getElementById('input-obstaculos') as HTMLInputElement,
    inputEnemigos: document.getElementById('input-enemigos') as HTMLInputElement,
    inputPresas: document.getElementById('input-presas') as HTMLInputElement,
    inputVelocidad: document.getElementById('input-velocidad') as HTMLInputElement,
    valVelocidad: document.getElementById('val-velocidad') as HTMLElement
};

/**
 * ESTADO DE LA APLICACIÓN
 */
let turnosRealizados = 0;
const ctx = DOM.canvas.getContext('2d');

if (!ctx) {
    throw new Error('Crítico: No se pudo inicializar el contexto de dibujo Canvas.');
}

/**
 * INICIALIZACIÓN DEL MOTOR
 */
let motorJuego = new SurvivorGame(parseInt(DOM.inputAncho.value), parseInt(DOM.inputAlto.value));

/**
 * Sincroniza los contadores de la interfaz con el estado del motor.
 */
function refrescarInterfaz(): void {
    DOM.turnCount.textContent = turnosRealizados.toString();
    DOM.presaCount.textContent = motorJuego.getContadorPresas().toString();
    DOM.enemigoCount.textContent = motorJuego.getContadorEnemigos().toString();
}

/**
 * Inicia o reinicia el ciclo de vida del juego con los parámetros actuales.
 */
async function arrancarPartida(): Promise<void> {
    // 1. Detener ejecución previa si existe
    motorJuego.stop();
    // Esperar un pequeño frame para asegurar que el bucle anterior se detuvo
    await new Promise(resolve => setTimeout(resolve, 50));

    // 2. Obtener valores de la interfaz
    const config = {
        ancho: Math.max(10, parseInt(DOM.inputAncho.value) || 10),
        alto: Math.max(10, parseInt(DOM.inputAlto.value) || 10),
        obstaculos: Math.max(0, parseInt(DOM.inputObstaculos.value) || 0),
        enemigos: Math.max(1, parseInt(DOM.inputEnemigos.value) || 1),
        presas: Math.max(1, parseInt(DOM.inputPresas.value) || 1),
        velocidad: parseInt(DOM.inputVelocidad.value)
    };

    // 3. Reconfigurar motor y tablero
    motorJuego = new SurvivorGame(config.ancho, config.alto);
    motorJuego.getTablero().setContext(ctx!, 15); // Re-vincular contexto
    motorJuego.setVelocidad(config.velocidad);

    // Ajustar tamaño del canvas físicamente
    DOM.canvas.width = config.ancho * 15;
    DOM.canvas.height = config.alto * 15;

    // 4. Preparar UI
    DOM.statusOverlay.classList.add('hidden');
    turnosRealizados = 0;
    
    // 5. Poblar mundo
    motorJuego.iniciar(config.obstaculos, config.enemigos, config.presas);
    refrescarInterfaz();
    
    // 6. Ejecutar loop de simulación
    const mensajeResultado = await motorJuego.ejecutar(() => {
        turnosRealizados++;
        motorJuego.getTablero().dibujar(motorJuego.getEntidades());
        refrescarInterfaz();
    });

    // 7. Mostrar fin de juego
    DOM.statusText.textContent = mensajeResultado;
    DOM.statusOverlay.classList.remove('hidden');
}

/**
 * LISTENERS DE EVENTOS
 */

// Actualizar texto de velocidad al mover el slider
DOM.inputVelocidad.addEventListener('input', () => {
    DOM.valVelocidad.textContent = `${DOM.inputVelocidad.value}ms`;
    motorJuego.setVelocidad(parseInt(DOM.inputVelocidad.value));
});

DOM.restartBtn.addEventListener('click', () => {
    arrancarPartida();
});

DOM.overlayRestartBtn.addEventListener('click', () => {
    arrancarPartida();
});

// Iniciamos automáticamente al cargar la web
arrancarPartida();

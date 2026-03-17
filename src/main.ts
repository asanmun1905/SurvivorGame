import './style.css';
import { SurvivorGame } from './engine/SurvivorGame';
import { WaveGame, CLASES_STATS, type ClaseWave } from './engine/WaveGame';
import { BulletHell } from './engine/BulletHell';
import { PlayableSandbox } from './engine/PlayableSandbox';
import bgImgUrl from '../assets/Background/background.png';

/** ─────────────────── DOM ─────────────────── */
const get = (id: string) => document.getElementById(id) as HTMLElement;

const DOM = {
    // ── Screens
    mainMenu: get('main-menu'),
    gameScreen: get('game-screen'),

    // ── Main menu
    btnStart: get('btn-start'),
    btnOleadas: get('btn-oleadas'),
    btnBulletHell: get('btn-bullethell'),
    btnSettings: get('btn-settings') as HTMLButtonElement,

    // ── Settings
    settingsOverlay: get('settings-overlay'),
    btnCloseSettings: get('close-settings') as HTMLButtonElement,
    btnSaveSettings: get('save-settings') as HTMLButtonElement,

    // ── Sandbox Choice Overlay
    sandboxChoiceOverlay: get('sandbox-choice-overlay'),
    btnChoiceSim: get('btn-choice-sim'),
    btnChoiceJugable: get('btn-choice-jugable'),
    btnBackFromChoice: get('btn-back-from-choice') as HTMLButtonElement,

    // ── Sandbox Jugable Menu
    psbSetupOverlay: get('psb-setup-overlay'),
    btnClosePsbSetup: get('close-psb-setup') as HTMLButtonElement,
    btnPsbToGrid: get('btn-psb-to-grid') as HTMLButtonElement,
    inputPsbHp: get('input-psb-hp') as HTMLInputElement,
    inputPsbDmg: get('input-psb-dmg') as HTMLInputElement,
    inputPsbAncho: get('input-psb-ancho') as HTMLInputElement,
    inputPsbAlto: get('input-psb-alto') as HTMLInputElement,
    psbClassSelection: get('psb-class-selection'),
    psbSidebar: get('psb-sidebar'),
    btnClosePsbSidebar: get('close-psb-sidebar') as HTMLButtonElement,
    btnRunPsb: get('btn-run-psb') as HTMLButtonElement,

    // ── Class select
    classSelectOverlay: get('class-select-overlay'),
    btnBackFromClass: get('btn-back-from-class') as HTMLButtonElement,

    // ── BH Difficulty
    bhDiffOverlay: get('bh-difficulty-overlay'),
    btnBackFromBH: get('btn-back-from-bh') as HTMLButtonElement,

    // ── Wave End Overlay
    waveEndOverlay: get('wave-end-overlay'),
    waveEndTitle: get('wave-end-title'),
    waveEndDesc: get('wave-end-desc'),
    waveEndIcon: get('wave-end-icon'),
    waveEndGoldDisplay: get('wave-end-gold-display'),
    btnNextWave: get('btn-next-wave') as HTMLButtonElement,
    btnWaveEndMenu: get('btn-wave-end-menu') as HTMLButtonElement,
    // wave-end shop buttons
    wbtnHp: get('wbtn-hp') as HTMLButtonElement,
    wbtnDmg: get('wbtn-dmg') as HTMLButtonElement,
    wbtnSpd: get('wbtn-spd') as HTMLButtonElement,
    wbtnGold: get('wbtn-gold') as HTMLButtonElement,
    wbtnPotion: get('wbtn-potion') as HTMLButtonElement,
    wbtnShield: get('wbtn-shield') as HTMLButtonElement,
    wcostHp: get('wcost-hp'),
    wcostDmg: get('wcost-dmg'),
    wcostSpd: get('wcost-spd'),
    wcostGold: get('wcost-gold'),
    // wcostExp removed

    // ── Status banner
    statusBanner: get('status-banner'),

    // ── In-game header
    app: get('app'),
    btnBackToMenu: get('menu-back-btn') as HTMLButtonElement,
    headerHomeBtn: get('header-home-btn'),

    // ── Sim sidebar
    simSidebar: get('sim-sidebar'),
    btnToggleSimSidebar: get('toggle-sim-sidebar-btn') as HTMLButtonElement,
    btnCloseSimSidebar: get('close-sim-sidebar') as HTMLButtonElement,
    btnRunSimulation: get('btn-run-simulation') as HTMLButtonElement,
    btnPauseSimulation: get('btn-pause-simulation') as HTMLButtonElement,

    // ── Wave shop sidebar
    oleadasSidebar: get('oleadas-sidebar'),
    btnToggleOleadasShop: get('toggle-oleadas-shop-btn') as HTMLButtonElement,
    oleadasGold: get('oleadas-gold'),
    shopBtnHp: get('shop-btn-hp') as HTMLButtonElement,
    shopBtnDmg: get('shop-btn-dmg') as HTMLButtonElement,
    shopBtnSpd: get('shop-btn-spd') as HTMLButtonElement,
    shopBtnGold: get('shop-btn-gold') as HTMLButtonElement,
    shopBtnPotion: get('shop-btn-potion') as HTMLButtonElement,
    shopBtnShield: get('shop-btn-shield') as HTMLButtonElement,
    costHp: get('cost-hp'),
    costDmg: get('cost-dmg'),
    costSpd: get('cost-spd'),
    costGold: get('cost-gold'),
    // costExp removed

    // ── Sim HUD
    turnCount: get('turn-count'),
    presaCount: get('presa-count'),
    enemigoCount: get('enemigo-count'),
    hudTurno: get('hud-turno'),
    hudCazadores: get('hud-cazadores'),
    hudBestias: get('hud-bestias'),

    // ── Wave HUD
    waveHud: get('wave-hud'),
    waveHpText: get('wave-hp-text'),
    waveHpFill: get('wave-hp-fill'),
    waveNum: get('wave-num'),
    waveEnemies: get('wave-enemies'),
    waveKills: get('hud-kills'),
    waveGoldHud: get('hud-gold'),
    waveTime: get('wave-time'),
    skillWrap: document.querySelector('.skill-cooldown-wrap') as HTMLElement,
    skillName: get('skill-name'),
    skillCdFill: get('skill-cd-fill'),
    skillReady: get('skill-ready'),

    // ── BH HUD
    bhHud: get('bh-hud'),
    bhLivesContainer: get('bh-lives-container'),
    bhTimer: get('bh-timer'),

    // ── Status overlay (end screen)
    statusOverlay: get('status-overlay'),
    statusText: get('status-text'),
    overlayRestartBtn: get('overlay-restart-btn'),
    overlayMenuBtn: get('overlay-menu-btn'),

    // ── Canvas
    canvas: get('game-canvas') as HTMLCanvasElement,

    // ── Config inputs
    inputAncho: get('input-ancho') as HTMLInputElement,
    inputAlto: get('input-alto') as HTMLInputElement,
    inputObstaculos: get('input-obstaculos') as HTMLInputElement,
    inputVelocidad: get('input-velocidad') as HTMLInputElement,
    valVelocidad: get('val-velocidad'),
    // Boss HUD
    bossHud: get('boss-hud'),
    bossHpFill: get('boss-hp-fill'),
    inputBrightness: get('input-brightness') as HTMLInputElement,
    // Buff overlay
    buffSelectionOverlay: get('buff-selection-overlay'),
    buffOptionsContainer: get('buff-options-container'),
};

const ctx = DOM.canvas.getContext('2d')!;
const CELL_SIZE = 80;

/** ─────────────────── STATE ─────────────────── */
type GameMode = 'sim' | 'oleadas' | 'bullethell' | 'sandbox-jugable';

let gameMode: GameMode = 'sim';
let simGame: SurvivorGame | null = null;
let waveMotor: WaveGame | null = null;
let bhMotor: BulletHell | null = null;
let psbMotor: PlayableSandbox | null = null;
let simRunning = false;
let currentTool: 'Obstaculo' | 'Enemigo' | 'Tank' | 'Sprinter' | 'Presa' | 'Eraser' | 'Boss' = 'Obstaculo';
let psbCurrentTool: string = 'PlayerStart';
let isPainting = false;
let psbSelectedClass: ClaseWave = 'guerrero';
let turns = 0;

// Map class to skill name
const SKILL_NAMES: Record<ClaseWave, string> = {
    guerrero: 'Golpe Sísmico',
    arquero: 'Lluvia de Flechas'
};

/** ─────────────────── HELPERS ─────────────────── */
function getConfig() {
    return {
        ancho: Math.max(5, parseInt(DOM.inputAncho.value) || 20),
        alto: Math.max(5, parseInt(DOM.inputAlto.value) || 12),
        obstaculos: Math.max(0, parseInt(DOM.inputObstaculos.value) || 25),
        enemigos: 8, // Default value
        presas: 12,  // Default value
        velocidad: parseInt(DOM.inputVelocidad.value) || 120,
    };
}

function setCanvasSize(w: number, h: number) {
    DOM.canvas.width = w;
    DOM.canvas.height = h;
}

function showEndScreen(msg: string) {
    const isGood = msg.includes('COMPLETADA') || msg.includes('SOBREVIVISTE');
    DOM.statusText.textContent = msg;
    DOM.statusText.className = isGood ? 'good-ending' : 'bad-ending';
    DOM.statusOverlay.classList.remove('hidden');
}

function stopAllEngines() {
    simGame?.stop();
    simGame?.getTablero().detenerRenderLoop();
    waveMotor?.stop();
    bhMotor?.stop();
    psbMotor?.stop();
    simGame = null;
    waveMotor = null;
    bhMotor = null;
    psbMotor = null;
    simRunning = false;
}

function hideSidebars() {
    DOM.simSidebar.classList.add('hidden');
    DOM.oleadasSidebar.classList.add('hidden');
    DOM.psbSidebar.classList.add('hidden');
    DOM.btnToggleSimSidebar.classList.add('hidden');
    DOM.btnToggleOleadasShop.classList.add('hidden');
    DOM.app.style.paddingRight = '0';
}

function enterGameScreen() {
    DOM.mainMenu.classList.add('hidden');
    DOM.gameScreen.classList.remove('hidden');
    DOM.statusOverlay.classList.add('hidden');
    DOM.waveEndOverlay.classList.add('hidden');
    DOM.bhHud.classList.add('hidden');
    DOM.waveHud.classList.add('hidden');
    DOM.bossHud.classList.add('hidden');
    DOM.hudCazadores.classList.remove('hidden');
    DOM.hudBestias.classList.remove('hidden');
    DOM.hudTurno.classList.remove('hidden');
    turns = 0;
    hideSidebars();
}

function irAlMenu() {
    stopAllEngines();
    DOM.gameScreen.classList.add('hidden');
    DOM.waveEndOverlay.classList.add('hidden');
    DOM.mainMenu.classList.remove('hidden');
    hideSidebars();
}

let bannerTimeout: number = 0;
function showBanner(msg: string) {
    clearTimeout(bannerTimeout);
    const b = DOM.statusBanner;
    b.textContent = msg;
    b.className = 'status-banner'; // re-trigger animation
    void b.offsetWidth;
    b.classList.remove('hidden');
    bannerTimeout = setTimeout(() => b.classList.add('hidden'), 2600) as unknown as number;
}

/** ─────────────────── WAVE SHOP HELPERS ─────────────────── */
function refreshShopCosts() {
    if (!waveMotor) return;
    const c = waveMotor.getShopCosts();
    if (DOM.costHp) DOM.costHp.textContent = `${c.hp}g`;
    if (DOM.wcostHp) DOM.wcostHp.textContent = `${c.hp}g`;
    if (DOM.costDmg) DOM.costDmg.textContent = `${c.damage}g`;
    if (DOM.wcostDmg) DOM.wcostDmg.textContent = `${c.damage}g`;
    if (DOM.costSpd) DOM.costSpd.textContent = `${c.speed}g`;
    if (DOM.wcostSpd) DOM.wcostSpd.textContent = `${c.speed}g`;
    if (DOM.costGold) DOM.costGold.textContent = `${c.gold}g`;
    if (DOM.wcostGold) DOM.wcostGold.textContent = `${c.gold}g`;
}

function updateWaveGold(g: number) {
    DOM.oleadasGold.textContent = g.toString();
    DOM.waveGoldHud.textContent = g.toString();
    DOM.waveEndGoldDisplay.textContent = g.toString();
}

/** ─────────────────── MODE: SIMULACIÓN ─────────────────── */
async function arrancarSimulacion() {
    gameMode = 'sim';
    enterGameScreen();
    DOM.hudTurno.classList.remove('hidden');
    DOM.hudCazadores.classList.remove('hidden');
    DOM.hudBestias.classList.remove('hidden');

    const cfg = getConfig();
    stopAllEngines();
    await new Promise(r => setTimeout(r, 40));

    const cw = cfg.ancho * CELL_SIZE;
    const ch = cfg.alto * CELL_SIZE;
    setCanvasSize(cw, ch);

    simGame = new SurvivorGame(cfg.ancho, cfg.alto);
    simGame.getTablero().setContext(ctx, CELL_SIZE);
    simGame.iniciar(cfg.obstaculos, cfg.enemigos, cfg.presas);

    DOM.presaCount.textContent = simGame.getContadorPresas().toString();
    DOM.enemigoCount.textContent = simGame.getContadorEnemigos().toString();

    simGame.getTablero().iniciarRenderLoop(() => simGame!.getEntidades());

    // Show sim sidebar and toggle button
    DOM.simSidebar.classList.remove('hidden');
    DOM.btnToggleSimSidebar.classList.remove('hidden');
    DOM.app.style.paddingRight = '260px';
    DOM.btnRunSimulation.style.display = '';
    DOM.btnPauseSimulation.style.display = 'none';
}

async function iniciarSimulacionRun() {
    if (!simGame || simRunning) return;
    simRunning = true;
    DOM.btnRunSimulation.style.display = 'none';
    DOM.btnPauseSimulation.style.display = '';
    simGame.setVelocidad(getConfig().velocidad);

    const msg = await simGame.ejecutar(() => {
        turns++;
        DOM.turnCount.textContent = turns.toString();
        DOM.presaCount.textContent = simGame?.getContadorPresas().toString() ?? '0';
        DOM.enemigoCount.textContent = simGame?.getContadorEnemigos().toString() ?? '0';
    });

    simRunning = false;
    DOM.btnRunSimulation.style.display = '';
    DOM.btnPauseSimulation.style.display = 'none';
    showEndScreen(msg);
}

/** ─────────────────── MODE: SANDBOX JUGABLE ─────────────────── */
function openPsbSetup() {
    stopAllEngines();
    // Populate class selection for PSB if not already
    if (DOM.psbClassSelection.innerHTML.trim() === '') {
        DOM.psbClassSelection.innerHTML = `
            <div class="class-card active" data-psbclase="guerrero" style="transform:none; cursor:pointer;">
                <div class="class-icon">⚔️</div>
                <h3>Guerrero</h3>
            </div>
            <div class="class-card" data-psbclase="arquero" style="transform:none; cursor:pointer;">
                <div class="class-icon">🏹</div>
                <h3>Arquero</h3>
            </div>
        `;
        document.querySelectorAll<HTMLElement>('[data-psbclase]').forEach(c => {
            c.onclick = () => {
                document.querySelectorAll('[data-psbclase]').forEach(cc => cc.classList.remove('active'));
                c.classList.add('active');
                psbSelectedClass = c.dataset.psbclase as ClaseWave;
            };
        });
    }
    DOM.psbSetupOverlay.classList.remove('hidden');
}

function arrancarPlayableSandboxGrid() {
    gameMode = 'sandbox-jugable';
    enterGameScreen();
    DOM.hudTurno.classList.add('hidden');
    DOM.hudCazadores.classList.add('hidden');
    DOM.hudBestias.classList.add('hidden');
    DOM.psbSidebar.classList.remove('hidden');
    DOM.app.style.paddingRight = '260px';

    const cw = Math.max(10, parseInt(DOM.inputPsbAncho.value) || 20) * 60;
    const ch = Math.max(10, parseInt(DOM.inputPsbAlto.value) || 12) * 60;
    setCanvasSize(cw, ch);

    psbMotor = new PlayableSandbox(DOM.canvas, {
        onHpChange: (hp, max) => {
             const pct = Math.max(0, (hp / max) * 100);
             DOM.waveHpText.textContent = `${Math.max(0, Math.round(hp))}/${max}`;
             DOM.waveHpFill.style.width = `${pct}%`;
             DOM.waveHpFill.className = 'wave-hp-fill' + (pct < 25 ? ' low' : pct < 50 ? ' mid' : '');
        },
        onKillsChange: (k) => { DOM.waveKills.textContent = k.toString(); },
        onEnemiesChange: (n) => { DOM.waveEnemies.textContent = n.toString(); },
        onGameOver: (kills) => { showEndScreen(`FIN DEL SANDBOX (Kills: ${kills})`); },
        onSkillCooldown: (_ready, pct) => {
             DOM.skillCdFill.style.width = `${(pct) * 100}%`;
             if (pct <= 0) DOM.skillReady.classList.remove('hidden');
             else DOM.skillReady.classList.add('hidden');
        },
        onBossHpChange: (hp, max, visible) => {
             if (visible) {
                  DOM.bossHud.classList.remove('hidden');
                  const pct = Math.max(0, (hp / max) * 100);
                  DOM.bossHpFill.style.width = `${pct}%`;
             } else {
                  DOM.bossHud.classList.add('hidden');
             }
        }
    });

    psbMotor.setCellSize(60);
    psbMotor.drawSetup();
}

function iniciarPlayableSandboxRutina() {
    if (!psbMotor || gameMode !== 'sandbox-jugable') return;
    DOM.psbSidebar.classList.add('hidden');
    DOM.app.style.paddingRight = '0';
    DOM.waveHud.classList.remove('hidden');
    DOM.skillName.textContent = SKILL_NAMES[psbSelectedClass];
    DOM.waveKills.textContent = '0';
    // hide unneeded elements in waveHud for sandbox
    get('hud-gold').style.display = 'none';
    get('wave-num').parentElement!.style.display = 'none';
    get('wave-time').parentElement!.style.display = 'none';
    
    const claseBaseStats = CLASES_STATS[psbSelectedClass];
    const bonusHp = parseInt(DOM.inputPsbHp.value) || 0;
    const bonusDmg = parseInt(DOM.inputPsbDmg.value) || 0;
    psbMotor.startPlayPhase({
         clase: psbSelectedClass,
         hp: claseBaseStats.hp + bonusHp,
         damage: claseBaseStats.damage + bonusDmg,
         speed: claseBaseStats.speed, x: 0, y: 0
    });
}
function arrancarOleadas(clase: ClaseWave) {
    gameMode = 'oleadas';
    enterGameScreen();

    // Wave mode uses the full visible area for the canvas
    const h = Math.max(500, window.innerHeight - 70);
    const w = Math.max(800, window.innerWidth - 270); // leave room for sidebar
    setCanvasSize(w, h);

    // HUD — wave-specific
    DOM.hudTurno.classList.add('hidden');
    DOM.hudCazadores.classList.add('hidden');
    DOM.hudBestias.classList.add('hidden');
    DOM.waveHud.classList.remove('hidden');
    DOM.skillName.textContent = SKILL_NAMES[clase];

    // Show shop sidebar
    DOM.oleadasSidebar.classList.remove('hidden');
    DOM.btnToggleOleadasShop.classList.remove('hidden');
    DOM.app.style.paddingRight = '260px';

    stopAllEngines();

    waveMotor = new WaveGame(DOM.canvas, clase, {
        onWaveChange: (n) => {
            DOM.waveNum.textContent = n.toString();
            showBanner(`⚔️ OLEADA ${n}`);
        },
        onHpChange: (hp, max) => {
            const pct = Math.max(0, (hp / max) * 100);
            DOM.waveHpText.textContent = `${Math.max(0, Math.round(hp))}/${max}`;
            DOM.waveHpFill.style.width = `${pct}%`;
            DOM.waveHpFill.className = 'wave-hp-fill' + (pct < 25 ? ' low' : pct < 50 ? ' mid' : '');
        },
        onKillsChange: (k) => { DOM.waveKills.textContent = k.toString(); },
        onGoldChange: (g) => { updateWaveGold(g); refreshShopCosts(); },
        onTimeChange: (t) => { DOM.waveTime.textContent = Math.floor(t).toString(); },
        onEnemiesChange: (n) => { DOM.waveEnemies.textContent = n.toString(); },
        onGameOver: (kills) => {
            showEndScreen(`LAS BESTIAS HAN GANADO (Kills: ${kills})`);
        },
        onWaveEnd: (_oleada, gold) => {
            // Show the inter-wave shop overlay
            DOM.waveEndIcon.textContent = '🏆';
            DOM.waveEndTitle.textContent = `La caza ha sido completada`;
            DOM.waveEndDesc.textContent = 'Gasta tu oro antes de la siguiente oleada.';
            DOM.waveEndGoldDisplay.textContent = gold.toString();
            refreshShopCosts();
            DOM.waveEndOverlay.classList.remove('hidden');
        },
        onSkillCooldown: (_ready, pct) => {
            DOM.skillCdFill.style.width = `${(pct) * 100}%`;
            if (pct <= 0) {
                DOM.skillReady.classList.remove('hidden');
            } else {
                DOM.skillReady.classList.add('hidden');
            }
        },
        onStatusMsg: (msg) => {
            DOM.statusBanner.textContent = msg;
            DOM.statusBanner.classList.remove('hidden');
            // Re-trigger animation by removing/adding
            DOM.statusBanner.style.animation = 'none';
            void DOM.statusBanner.offsetHeight;
            DOM.statusBanner.style.animation = '';
        },
        onBossHpChange: (hp, max, visible) => {
            if (visible) {
                DOM.bossHud.classList.remove('hidden');
                const pct = Math.max(0, (hp / max) * 100);
                DOM.bossHpFill.style.width = `${pct}%`;
            } else {
                DOM.bossHud.classList.add('hidden');
            }
        },
        onBuffDrop: (options) => {
            DOM.buffOptionsContainer.innerHTML = '';
            options.forEach(buff => {
                const card = document.createElement('div');
                card.className = 'class-card';
                card.innerHTML = `
                    <div class="class-icon">${buff.icon}</div>
                    <h3>${buff.label}</h3>
                    <p>${buff.desc}</p>
                `;
                card.onclick = () => {
                   if (waveMotor) waveMotor.applyBuff(buff.type);
                   DOM.buffSelectionOverlay.classList.add('hidden');
                };
                DOM.buffOptionsContainer.appendChild(card);
            });
            DOM.buffSelectionOverlay.classList.remove('hidden');
        }
    });

    refreshShopCosts();
    waveMotor.start();
}

/** ─────────────────── MODE: BULLET HELL ─────────────────── */
function arrancarBulletHell(lives: number) {
    gameMode = 'bullethell';
    enterGameScreen();

    const w = Math.max(800, window.innerWidth - 20);
    const h = Math.max(500, window.innerHeight - 80);
    setCanvasSize(w, h);

    DOM.bhHud.classList.remove('hidden');
    DOM.hudCazadores.classList.add('hidden');
    DOM.hudBestias.classList.add('hidden');
    DOM.hudTurno.classList.add('hidden');

    buildLifeIcons(lives, lives);
    stopAllEngines();

    bhMotor = new BulletHell(
        DOM.canvas, lives, bgImgUrl,
        (rem) => buildLifeIcons(rem, lives),
        (elapsed) => { DOM.bhTimer.textContent = `${Math.floor(elapsed)}s`; },
        (survived) => { showEndScreen(`SOBREVIVISTE ${survived} SEGUNDOS EN EL BULLET HELL.`); }
    );
    bhMotor.start();
}

function buildLifeIcons(current: number, max: number) {
    DOM.bhLivesContainer.innerHTML = '';
    for (let i = 0; i < max; i++) {
        const span = document.createElement('span');
        span.className = 'bh-life-icon' + (i >= current ? ' lost' : '');
        span.textContent = '❤️';
        DOM.bhLivesContainer.appendChild(span);
    }
}

/** ─────────────────── PAINTING (SIM / PSB) ─────────────────── */
function paintAt(e: MouseEvent) {
    const rect = DOM.canvas.getBoundingClientRect();
    const scaleX = DOM.canvas.width / rect.width;
    const scaleY = DOM.canvas.height / rect.height;
    const gx = Math.floor(((e.clientX - rect.left) * scaleX) / (gameMode === 'sim' ? CELL_SIZE : 60));
    const gy = Math.floor(((e.clientY - rect.top) * scaleY) / (gameMode === 'sim' ? CELL_SIZE : 60));

    if (gameMode === 'sim') {
        if (!simGame || simRunning) return;
        if (currentTool === 'Eraser') simGame.clearEntityAt(gx, gy);
        else simGame.addEntityAt(currentTool, gx, gy);
        DOM.presaCount.textContent = simGame.getContadorPresas().toString();
        DOM.enemigoCount.textContent = simGame.getContadorEnemigos().toString();
    } else if (gameMode as string === 'sandbox-jugable') {
        if (!psbMotor) return;
        if (psbCurrentTool === 'Eraser') psbMotor.removeEntityGrid(gx, gy);
        else psbMotor.addEntityGrid(psbCurrentTool, gx, gy);
    }
}

/** ─────────────────── EVENT BINDINGS ─────────────────── */

// Main menu
DOM.btnStart.onclick = () => DOM.sandboxChoiceOverlay.classList.remove('hidden');
DOM.btnOleadas.onclick = () => { stopAllEngines(); DOM.classSelectOverlay.classList.remove('hidden'); };
DOM.btnBulletHell.onclick = () => { stopAllEngines(); DOM.bhDiffOverlay.classList.remove('hidden'); };

// Sandbox Choice
DOM.btnChoiceSim.onclick = () => {
    DOM.sandboxChoiceOverlay.classList.add('hidden');
    arrancarSimulacion();
};
DOM.btnChoiceJugable.onclick = () => {
    DOM.sandboxChoiceOverlay.classList.add('hidden');
    openPsbSetup();
};
DOM.btnBackFromChoice.onclick = () => DOM.sandboxChoiceOverlay.classList.add('hidden');

// Settings
DOM.btnSettings.onclick = () => DOM.settingsOverlay.classList.remove('hidden');
DOM.btnCloseSettings.onclick = () => DOM.settingsOverlay.classList.add('hidden');
DOM.btnSaveSettings.onclick = () => DOM.settingsOverlay.classList.add('hidden');

// Class select (only in class-select-overlay)
document.querySelectorAll<HTMLElement>('#class-select-overlay .class-card').forEach(card => {
    card.onclick = () => {
        const clase = card.dataset.clase as ClaseWave;
        if (!clase) return;
        DOM.classSelectOverlay.classList.add('hidden');
        arrancarOleadas(clase);
    };
});
DOM.btnBackFromClass.onclick = () => DOM.classSelectOverlay.classList.add('hidden');

// BH Difficulty
document.querySelectorAll<HTMLElement>('.diff-card').forEach(card => {
    card.onclick = () => {
        const lives = parseInt(card.dataset.lives ?? '3');
        DOM.bhDiffOverlay.classList.add('hidden');
        arrancarBulletHell(lives);
    };
});
DOM.btnBackFromBH.onclick = () => DOM.bhDiffOverlay.classList.add('hidden');

// Navigation
DOM.btnBackToMenu.onclick = irAlMenu;
DOM.headerHomeBtn.onclick = irAlMenu;
DOM.overlayMenuBtn.onclick = irAlMenu;
DOM.overlayRestartBtn.onclick = () => {
    DOM.statusOverlay.classList.add('hidden');
    if (gameMode === 'oleadas') { DOM.classSelectOverlay.classList.remove('hidden'); DOM.gameScreen.classList.add('hidden'); DOM.mainMenu.classList.remove('hidden'); }
    else if (gameMode === 'bullethell') { DOM.bhDiffOverlay.classList.remove('hidden'); DOM.gameScreen.classList.add('hidden'); DOM.mainMenu.classList.remove('hidden'); }
    else arrancarSimulacion();
};

// Sim sidebar
DOM.btnToggleSimSidebar.onclick = () => {
    const hidden = DOM.simSidebar.classList.toggle('hidden');
    DOM.app.style.paddingRight = hidden ? '0' : '260px';
};
DOM.btnCloseSimSidebar.onclick = () => { DOM.simSidebar.classList.add('hidden'); DOM.app.style.paddingRight = '0'; };
DOM.btnRunSimulation.onclick = () => iniciarSimulacionRun();
DOM.btnPauseSimulation.onclick = () => {
    simGame?.stop();
    simRunning = false;
    DOM.btnRunSimulation.style.display = '';
    DOM.btnPauseSimulation.style.display = 'none';
};

// PSB sidebar & setup
DOM.btnClosePsbSetup.onclick = () => DOM.psbSetupOverlay.classList.add('hidden');
DOM.btnPsbToGrid.onclick = () => {
     DOM.psbSetupOverlay.classList.add('hidden');
     arrancarPlayableSandboxGrid();
};
DOM.btnClosePsbSidebar.onclick = () => { DOM.psbSidebar.classList.add('hidden'); DOM.app.style.paddingRight = '0'; };
DOM.btnRunPsb.onclick = () => iniciarPlayableSandboxRutina();

// PSB Tool selection
document.querySelectorAll<HTMLElement>('#psb-sidebar [data-psb-tool]').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('[data-psb-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        psbCurrentTool = btn.dataset.psbTool as string;
    };
});

// Wave shop sidebar toggle
DOM.btnToggleOleadasShop.onclick = () => {
    const hidden = DOM.oleadasSidebar.classList.toggle('hidden');
    DOM.app.style.paddingRight = hidden ? '0' : '260px';
};

// ── Sidebar shop buttons (in-wave)
const shopAction = (fn: () => boolean) => {
    if (!waveMotor) return;
    fn();
    updateWaveGold(waveMotor.getPlayer().gold);
    refreshShopCosts();
};
DOM.shopBtnHp.onclick = () => shopAction(() => waveMotor!.upgradeHp());
DOM.shopBtnDmg.onclick = () => shopAction(() => waveMotor!.upgradeDamage());
DOM.shopBtnSpd.onclick = () => shopAction(() => waveMotor!.upgradeSpeed());
DOM.shopBtnGold.onclick = () => shopAction(() => waveMotor!.upgradeGoldGain());
DOM.shopBtnPotion.onclick = () => shopAction(() => waveMotor!.buyPotion());
DOM.shopBtnShield.onclick = () => shopAction(() => waveMotor!.buyShield());

// ── Wave-end overlay shop buttons
const waveShopAction = (fn: () => boolean) => {
    if (!waveMotor) return;
    fn();
    updateWaveGold(waveMotor.getPlayer().gold);
    refreshShopCosts();
};
DOM.wbtnHp.onclick = () => waveShopAction(() => waveMotor!.upgradeHp());
DOM.wbtnDmg.onclick = () => waveShopAction(() => waveMotor!.upgradeDamage());
DOM.wbtnSpd.onclick = () => waveShopAction(() => waveMotor!.upgradeSpeed());
DOM.wbtnGold.onclick = () => waveShopAction(() => waveMotor!.upgradeGoldGain());
DOM.wbtnPotion.onclick = () => waveShopAction(() => waveMotor!.buyPotion());
DOM.wbtnShield.onclick = () => waveShopAction(() => waveMotor!.buyShield());

// ── Next wave / abandon
DOM.btnNextWave.onclick = () => {
    if (!waveMotor) return;
    DOM.waveEndOverlay.classList.add('hidden');
    waveMotor.nextWave();
};
DOM.btnWaveEndMenu.onclick = irAlMenu;

// Speed slider (sim)
DOM.inputVelocidad.oninput = () => {
    const v = parseInt(DOM.inputVelocidad.value);
    DOM.valVelocidad.textContent = `${v}ms`;
    simGame?.setVelocidad(v);
};

// Brightness
DOM.inputBrightness.oninput = () => {
    document.documentElement.style.setProperty('--brightness', DOM.inputBrightness.value);
};

// Tool selection (sim sidebar only)
document.querySelectorAll<HTMLElement>('#sim-sidebar .tool-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('#sim-sidebar .tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool as typeof currentTool;
    };
});

// Canvas painting (sim & psb)
DOM.canvas.addEventListener('mousedown', (e) => {
    if (gameMode === 'sim') {
        if (!simGame || simRunning) return;
        isPainting = true;
        paintAt(e);
    } else if (gameMode as string === 'sandbox-jugable') {
        if (!psbMotor || (psbMotor as any).mode === 'play') return;
        isPainting = true;
        paintAt(e);
    }
});

DOM.canvas.addEventListener('mouseup', () => {
    if (gameMode === 'sim' || gameMode as string === 'sandbox-jugable') isPainting = false;
});

DOM.canvas.addEventListener('mouseleave', () => {
    if (gameMode === 'sim' || gameMode as string === 'sandbox-jugable') isPainting = false;
});
DOM.canvas.addEventListener('mousemove', (e) => { if (isPainting) paintAt(e); });
window.addEventListener('mouseup', () => { isPainting = false; });

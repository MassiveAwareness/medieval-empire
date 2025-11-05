if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

import { updateDisplay, showMessage } from './ui.js';
import { build, upgrade, gameLoop as logicGameLoop, saveGame, loadGame, resetGame, formatTime } from './gameLogic.js';

// --- ÚJ: A "ZÁSZLÓ" VÁLTOZÓ ---
// Ez a változó jelzi, ha a reset gomb miatt fog újratöltődni az oldal.
let isResetting = false;

// --- MÓDOSÍTVA: AUTOMATIKUS MENTÉS ---
window.addEventListener('beforeunload', (event) => {
    // Ha a 'isResetting' zászló igaz, akkor ne mentsünk, csak lépjünk ki.
    if (isResetting) {
        return;
    }
    console.log("Auto-saving game before unload...");
    saveGame();
});

function masterGameLoop() {
    logicGameLoop();
    updateDisplay();
}

function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar-inner');
    const gameContainer = document.getElementById('game-container');

    if (!loadingScreen || !progressBar || !gameContainer) {
        console.error("Loading screen elements not found, starting game immediately.");
        initializeGame();
        return;
    }

    gameContainer.style.display = 'block';

    setTimeout(() => { progressBar.style.width = '30%' }, 500);
    setTimeout(() => { progressBar.style.width = '70%' }, 1200);
    setTimeout(() => { progressBar.style.width = '100%' }, 2000);

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        initializeGame();
    }, 2500);
}

function initializeGame() {
    console.log("Initializing game on page:", window.location.pathname);

    if (window.location.pathname.endsWith('buildings.html')) {
        const buildingContainer = document.getElementById('building-list');
        if (buildingContainer) {
            buildingContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('upgrade-button')) {
                    const type = target.dataset.type;
                    const index = parseInt(target.dataset.index, 10);
                    upgrade(type, index);
                }
                if (target.classList.contains('add-building-button')) {
                    const type = target.dataset.type;
                    build(type);
                }
            });
        }
        
        const resetBtn = document.getElementById('reset-button');
        if (resetBtn) {
            // --- MÓDOSÍTVA: A RESET GOMB ESEMÉNYKEZELŐJE ---
            resetBtn.addEventListener('click', () => {
                // 1. Lépés: Állítsd be a zászlót, hogy jelezzük a reset szándékát.
                isResetting = true;
                // 2. Lépés: Hívd meg a szokásos reset logikát.
                resetGame();
            });
        }
    }
    
    const loadResult = loadGame();
    updateDisplay();

    const isNewSession = !sessionStorage.getItem('sessionStarted');
    if (isNewSession) {
        sessionStorage.setItem('sessionStarted', 'true');
        if (!loadResult.loaded) {
            showMessage('Welcome to your new empire! Build and govern your kingdom!', 'success');
        } else if (loadResult.offlineTime >= 120) {
            const timeAway = formatTime(loadResult.offlineTime);
            showMessage(`Welcome back! While you were away for ${timeAway}, your empire gathered resources.`, 'success');
        }
    }

    setInterval(masterGameLoop, 1000);
}

handleLoadingScreen();
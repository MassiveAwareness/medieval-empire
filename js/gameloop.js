// js/app.js

if (history.scrollRestoration) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);

import { updateDisplay, showMessage } from './ui.js';
import { build, upgrade, gameLoop as logicGameLoop, saveGame, loadGame, resetGame, formatTime } from './gameLogic.js';
import { initializeProfileModal } from './modal.js';

let isResetting = false;

window.addEventListener('beforeunload', (event) => {
    if (isResetting) return;
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
    console.log("Initializing game...");

    // Általános, minden oldalon futó inicializálások
    initializeProfileModal();

    // --- MÓDOSÍTVA: A RESET GOMB ESEMÉNYKEZELŐJE MOST MÁR ITT VAN, GLOBÁLISAN ---
    const resetBtn = document.getElementById('reset-game-button');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Adjunk hozzá egy megerősítő kérdést a biztonság kedvéért!
            if (confirm('Are you absolutely sure you want to reset all progress? This action cannot be undone.')) {
                isResetting = true;
                resetGame();
            }
        });
    }

    // Oldalspecifikus inicializálások (a reset gomb logikája innen el lett távolítva)
    if (window.location.pathname.endsWith('buildings.html')) {
        const buildingContainer = document.getElementById('building-list');
        if (buildingContainer) {
            buildingContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('upgrade-button')) {
                    upgrade(target.dataset.type, parseInt(target.dataset.index, 10));
                }
                if (target.classList.contains('add-building-button')) {
                    build(target.dataset.type);
                }
            });
        }
    }
    
    // Játék betöltése és a hurok indítása
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
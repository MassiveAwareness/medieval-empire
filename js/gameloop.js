// js/app.js

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

import { updateDisplay, showMessage } from './ui.js';
import { build, upgrade, gameLoop as logicGameLoop, saveGame, loadGame, resetGame } from './gameLogic.js';

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
        
        const saveBtn = document.getElementById('save-button');
        const resetBtn = document.getElementById('reset-button');
        if (saveBtn) saveBtn.addEventListener('click', saveGame);
        if (resetBtn) resetBtn.addEventListener('click', resetGame);
    }
    
    const wasGameLoaded = loadGame();
    updateDisplay();

    // Ellenőrizzük, hogy ebben a session-ben kiírtuk-e már az üdvözlő üzenetet.
    const hasBeenWelcomed = sessionStorage.getItem('medievalEmpireWelcomed');

    // Csak akkor írjuk ki, ha ez egy ÚJ játék ÉS MÉG NEM írtuk ki ebben a session-ben.
    if (!wasGameLoaded && !hasBeenWelcomed) {
        showMessage('Welcome to your new empire! Build and govern your kingdom!', 'success');
        
        // Elhelyezzük a "jelzőt" a sessionStorage-ben, hogy többet ne jelenjen meg.
        sessionStorage.setItem('medievalEmpireWelcomed', 'true');
    }

    setInterval(masterGameLoop, 1000);
}

handleLoadingScreen();
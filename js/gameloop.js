import { updateDisplay, showMessage } from './ui.js';
import { build, upgrade, gameLoop, saveGame, loadGame, resetGame } from './gameLogic.js';

if(history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

window.addEventListener('DOMContentLoaded', () => {
    const handleLoadingScreen = () => {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.getElementById('progress-bar-inner');

        setTimeout(() => { progressBar.style.width = '30%' }, 900);
        setTimeout(() => { progressBar.style.width = '70%' }, 2100);
        setTimeout(() => { progressBar.style.width = '100%' }, 3000);

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            initializeGame();
        }, 3500);
    };

    const initializeGame = () => {
        // Eseménykezelés a szülő elemen (Event Delegation)
        const buildingList = document.getElementById('building-list');
        if(buildingList) {
            buildingList.addEventListener('click', (event) => {
                const target = event.target;

                if(target.classList.contains('upgrade-button')) {
                    const type = target.dataset.type;
                    const index = parseInt(target.dataset.index, 10);
                    upgrade(type, index);
                }

                if(target.classList.contains('build-building-button')) {
                    const type = target.dataset.type;
                    build(type);
                }
            });
        }

        document.getElementById('save-button').addEventListener('click', saveGame);
        document.getElementById('reset-button').addEventListener('click', resetGame);

        const wasGameLoaded = loadGame();
        updateDisplay();

        if(!wasGameLoaded) showMessage('Welcome to your new empire! Build and govern your kingdom!', 'success');
        setInterval(gameLoop, 1000);
    };

    handleLoadingScreen();
});
import { showMessage, updateDisplay } from './ui.js';
import { upgradeBuilding, gameLoop, saveGame, loadGame, resetGame } from './gameLogic.js';

if(history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

window.addEventListener('DOMContentLoaded', () => {

    // --- Töltőképernyő logika ---
    const handleLoadingScreen = () => {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.getElementById('progress-bar-inner');

        // Betöltés szimulációja
        setTimeout(() => { progressBar.style.width = '30%' }, 500);
        setTimeout(() => { progressBar.style.width = '70%' }, 1800);
        setTimeout(() => { progressBar.style.width = '100%' }, 3000);

        // Eltűnik a töltőképernyőt és elindul a játék
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            initializeGame();
        }, 3500);
    };

    // --- Játék inicializálása ---
    const initializeGame = () => {
        // Eseménykezelők beállítása
        document.getElementById('upgrade-lumberyard').addEventListener('click', () => upgradeBuilding('lumberyard'));
        document.getElementById('upgrade-quarry').addEventListener('click', () => upgradeBuilding('quarry'));
        document.getElementById('upgrade-farm').addEventListener('click', () => upgradeBuilding('farm'));
        // ÚJ: Raktár gomb bekötése
        document.getElementById('upgrade-warehouse').addEventListener('click', upgradeBuilding('warehouse'));

        document.getElementById('save-button').addEventListener('click', saveGame);
        document.getElementById('reset-button').addEventListener('click', resetGame);

        // Játék betöltése és indítása
        const wasGameLoaded = loadGame();
        updateDisplay();

        if(!wasGameLoaded) showMessage('Welcome to your new empire! Build and govern your kingdom!', 'success');
        setInterval(gameLoop, 1000);
    };

    // --- Belépési pont ---
    // A szkript betöltődésekor elindítjuk a töltőképernyő kezelését
    handleLoadingScreen();
});
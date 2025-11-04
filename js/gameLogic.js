import { gameState, setGameState } from './state.js';
import { showMessage, updateDisplay, capitalizeFirstLetter } from './ui.js';

// --- Építési logika ---
export const upgradeBuilding = (buildingName) => {
    if(gameState.constructionQueue.length > 0) {
        showMessage('Your builder is already working!', 'error');
        return;
    }

    const building = gameState.buildings[buildingName];
    const currentLevel = building.level;
    const cost = {};
    for(const resource in building.cost) {
        cost[resource] = Math.floor(building.cost[resource] * Math.pow(1.5, currentLevel));
    }

    let canAfford = true;
    for(const resource in cost) {
        if(gameState.resources[resource] < cost[resource]) {
            canAfford = false;
            break;
        }
    }

    if(canAfford) {
        for(const resource in cost) gameState.resources[resource] -= cost[resource];

        const constructionTime = building.baseConstructionTime * (currentLevel + 1);
        const finishTime = Date.now() + constructionTime * 1000;
        gameState.constructionQueue.push({ buildingName, finishTime });

        const displayName = capitalizeFirstLetter(buildingName);
        showMessage(`${displayName}'s upgrade has started! Time: ${constructionTime}s`, 'success');
    } else showMessage(`Insufficient material for upgrade!`, 'error');

    updateDisplay();
};

// --- Game loop ---
export const gameLoop = () => {
    const now = Date.now();
    const completedJobs = [];
    gameState.constructionQueue.forEach(job => {
        if(now >= job.finishTime) {
            gameState.buildings[job.buildingName].level++;

            const displayName = capitalizeFirstLetter(job.buildingName);
            showMessage(`${job.buildingName}'s upgrade has finished!`, 'success');
            completedJobs.push(job);
        }
    });

    if(completedJobs.length > 0) gameState.constructionQueue = gameState.constructionQueue.filter(job => !completedJobs.includes(job));

    for(const buildingName in gameState.buildings) {
        const building = gameState.buildings[buildingName];
        if(building.level > 0) {
            if(buildingName === 'lumberyard') gameState.resources.wood += building.level * building.baseProduction;
            else if(buildingName === 'quarry') gameState.resources.stone += building.level * building.baseProduction;
            else if(buildingName === 'farm') gameState.resources.food += building.level * building.baseProduction;
        }
    }

    updateDisplay();
};

// --- Mentés / betöltés ---
export const saveGame = () => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    showMessage('Game state saved successfully!', 'success');
};

export const loadGame = () => {
    const savedStateJSON = localStorage.getItem('gameState');
    if(savedStateJSON) {
        let savedState = JSON.parse(savedStateJSON);
        if(!savedState.constructionQueue) savedState.constructionQueue = [];

        // A setGameState függvénnyel biztonságos felülírás hajtódhat végre
        setGameState(Object.assign(gameState, savedState));
        showMessage('Game state loaded successfully!', 'success');
    }
};

export const resetGame = () => {
    localStorage.removeItem('gameState');
    showMessage('Saved game state was deleted! Game resets...', 'success');
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); location.reload(); }, 3000);
};
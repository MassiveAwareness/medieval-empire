import { gameState } from './state.js';
import { showMessage, updateDisplay, capitalizeFirstLetter } from './ui.js';

export const build = (buildingType) => {
    const instances = gameState.buildings[buildingType];
    const meta = gameState.buildingMeta[buildingType];
    if (gameState.constructionQueue.length > 0) {
        showMessage('Your builder is already working!', 'error');
        return;
    }
    if (instances.length < meta.maxInstances) {
        instances.push({ level: 1 });
        showMessage(`A new ${meta.name} has been built!`, 'success');
        updateDisplay();
    } else {
        showMessage(`You have reached the maximum number of ${meta.name}s!`, 'error');
    }
};

export const upgrade = (buildingType, index) => {
    const building = gameState.buildings[buildingType][index];
    const meta = gameState.buildingMeta[buildingType];
    if (gameState.constructionQueue.length > 0) {
        showMessage('Your builder is already working!', 'error');
        return;
    }
    if (building.level >= meta.maxLevel) {
        showMessage('This building has reached its maximum level!', 'error');
        return;
    }
    const currentLevel = building.level;
    const cost = {};
    for (const resource in meta.cost) {
        cost[resource] = Math.floor(meta.cost[resource] * Math.pow(1.5, currentLevel));
    }
    let canAfford = true;
    for (const resource in cost) {
        if (gameState.resources[resource] < cost[resource]) {
            canAfford = false;
            break;
        }
    }
    if (canAfford) {
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        let constructionTime = meta.baseConstructionTime * (currentLevel + 1);
        const keepMeta = gameState.buildingMeta.keep;
        let totalKeepLevel = 0;
        gameState.buildings.keep.forEach(k => totalKeepLevel += k.level);
        const reductionFactor = 1 - (totalKeepLevel * keepMeta.constructionTimeReduction);
        constructionTime = Math.floor(constructionTime * reductionFactor);
        const finishTime = Date.now() + constructionTime * 1000;
        gameState.constructionQueue.push({ buildingType, index, finishTime });
        showMessage(`${meta.name} #${index + 1} upgrade has started! Time: ${constructionTime}s`, 'success');
    } else {
        showMessage('Insufficient material for upgrade!', 'error');
    }
    updateDisplay();
};

export const gameLoop = () => {
    const now = Date.now();
    const completedJobs = [];
    gameState.constructionQueue.forEach(job => {
        if (now >= job.finishTime) {
            gameState.buildings[job.buildingType][job.index].level++;
            const meta = gameState.buildingMeta[job.buildingType];
            showMessage(`${meta.name} #${job.index + 1} upgrade has finished!`, 'success');
            completedJobs.push(job);
        }
    });
    if (completedJobs.length > 0) {
        gameState.constructionQueue = gameState.constructionQueue.filter(job => !completedJobs.includes(job));
    }

    const warehouseMeta = gameState.buildingMeta.warehouse;
    const keepMeta = gameState.buildingMeta.keep;
    let totalWarehouseLevel = 0;
    gameState.buildings.warehouse.forEach(w => totalWarehouseLevel += w.level);
    let totalKeepLevel = 0;
    gameState.buildings.keep.forEach(k => totalKeepLevel += k.level);
    const totalBonusStorage = totalKeepLevel * keepMeta.storageBonus;
    const caps = {
        wood: gameState.baseStorage.wood + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease) + totalBonusStorage,
        stone: gameState.baseStorage.stone + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease) + totalBonusStorage,
        food: gameState.baseStorage.food + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease) + totalBonusStorage
    };

    let totalWoodProduction = 0;
    gameState.buildings.lumberyard.forEach(b => totalWoodProduction += b.level * gameState.buildingMeta.lumberyard.baseProduction);
    let totalStoneProduction = 0;
    gameState.buildings.quarry.forEach(b => totalStoneProduction += b.level * gameState.buildingMeta.quarry.baseProduction);
    let totalFoodProduction = 0;
    gameState.buildings.farm.forEach(b => totalFoodProduction += b.level * gameState.buildingMeta.farm.baseProduction);
    if (gameState.resources.wood < caps.wood) gameState.resources.wood += totalWoodProduction;
    if (gameState.resources.stone < caps.stone) gameState.resources.stone += totalStoneProduction;
    if (gameState.resources.food < caps.food) gameState.resources.food += totalFoodProduction;
    gameState.resources.wood = Math.min(gameState.resources.wood, caps.wood);
    gameState.resources.stone = Math.min(gameState.resources.stone, caps.stone);
    gameState.resources.food = Math.min(gameState.resources.food, caps.food);
};

export const saveGame = () => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    showMessage('Game state saved successfully!', 'success');
};

export const loadGame = () => {
    const savedStateJSON = localStorage.getItem('gameState');
    if (savedStateJSON) {
        let savedState = JSON.parse(savedStateJSON);
        if (savedState.resources) gameState.resources = savedState.resources;
        if (savedState.buildings) gameState.buildings = savedState.buildings;
        if (savedState.constructionQueue) gameState.constructionQueue = savedState.constructionQueue;
        for (const type in gameState.buildingMeta) {
            if (!gameState.buildings[type]) {
                gameState.buildings[type] = [];
            }
        }
        showMessage('Game state loaded successfully!', 'success');
        return true;
    }
    return false;
};

export const resetGame = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.removeItem('gameState');
    showMessage('Saved game state was deleted! Game resets...', 'success');
    setTimeout(() => { location.reload(); }, 1500);
};
import { gameState } from './state.js';

// ÚJ: Egy segédfüggvény, ami nagybetűssé teszi a szó első karakterét.
export const capitalizeFirstLetter = (string) => {
    if(!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const showMessage = (msg, type) => {
    const messageTextEl = document.getElementById('message-text');
    if(messageTextEl) {
        messageTextEl.textContent = msg;
        messageTextEl.style.color = type === 'error' ? '#d8000c' : '#4f8a10';
    }
};

export const updateBuildingUI = (name) => {
    const building = gameState.buildings[name];
    if(!building) return;

    const upgradeButton = document.getElementById(`upgrade-${name}`);
    const costEl = document.getElementById(`${name}-cost`);
    const isBuilderBusy = gameState.constructionQueue.length > 0;
    const constructionJob = gameState.constructionQueue.find(job => job.buildingName === name);

    if(constructionJob) {
        const timeLeft = Math.ceil((constructionJob.finishTime - Date.now()) / 1000);
        upgradeButton.disabled = true;
        upgradeButton.textContent = 'Upgrading...';
        costEl.textContent = `Remaining time: ${timeLeft > 0 ? timeLeft : 0}s`;
        costEl.style.fontWeight = 'bold';
    } else {
        costEl.style.fontWeight = 'normal';
        upgradeButton.disabled = isBuilderBusy;
        upgradeButton.textContent = 'Upgrade';

        const currentLevel = building.level;
        const nextCost = {};
        for(const resource in building.cost) nextCost[resource] = Math.floor(building.cost[resource] * Math.pow(1.5, currentLevel));

        const resourceNames = { wood: 'Wood', stone: 'Stone', food: 'Food' };
        const costString = Object.keys(nextCost)
            .map(resKey => `${resourceNames[resKey] || resKey}: ${nextCost[resKey]}`)
            .join(', ');
        costEl.textContent = `Cost: ${costString}`;
    }

    document.getElementById(`${name}-level`).textContent = building.level;
    document.getElementById(`${name}-production`).textContent = building.level * building.baseProduction;
};

export const updateDisplay = () => {
    for(const resource in gameState.resources) {
        const element = document.getElementById(`${resource}`);
        if(element) element.textContent = gameState.resources[resource];
    }

    for(const buildingName in gameState.buildings) updateBuildingUI(buildingName);
};
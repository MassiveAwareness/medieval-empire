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
    const levelEl = document.getElementById(`${name}-level`);
    const productionEl = document.getElementById(`${name}-production`); // Keressük meg az elemet

    const isBuilderBusy = gameState.constructionQueue.length > 0;
    const constructionJob = gameState.constructionQueue.find(job => job.buildingName === name);

    if (constructionJob) {
        if (upgradeButton) {
            upgradeButton.disabled = true;
            upgradeButton.textContent = 'Upgrading...';
        }
        if (costEl) {
            const timeLeft = Math.ceil((constructionJob.finishTime - Date.now()) / 1000);
            costEl.textContent = `Remaining time: ${timeLeft > 0 ? timeLeft : 0}s`;
            costEl.style.fontWeight = 'bold';
        }
    } else {
        if (upgradeButton) {
            upgradeButton.disabled = isBuilderBusy;
            upgradeButton.textContent = 'Upgrade';
        }
        if (costEl) {
            costEl.style.fontWeight = 'normal';
            const currentLevel = building.level;
            const nextCost = {};
            for(const resource in building.cost) nextCost[resource] = Math.floor(building.cost[resource] * Math.pow(1.5, currentLevel));

            const resourceNames = { wood: 'Wood', stone: 'Stone', food: 'Food' };
            const costString = Object.keys(nextCost)
                .map(resKey => `${resourceNames[resKey] || resKey}: ${nextCost[resKey]}`)
                .join(', ');
            costEl.textContent = `Cost: ${costString}`;
        }
    }

    // --- JAVÍTOTT SZEKCIÓ ---
    // Csak akkor próbáljuk frissíteni az elemeket, ha léteznek.
    if (levelEl) {
        levelEl.textContent = building.level;
    }
    
    // A Raktárnak nincs termelési sora, így a "productionEl" null lesz.
    // Ez az "if" feltétel megakadályozza a hibát.
    if (productionEl) {
        productionEl.textContent = building.level * building.baseProduction;
    }
};

export const updateDisplay = () => {
    // --- Nyersanyagok és Kapacitás ---
    const warehouse = gameState.buildings.warehouse;
    // Biztonsági ellenőrzés, ha a raktár valamiért nem létezne
    const warehouseLevel = warehouse ? warehouse.level : 0;
    const warehouseStorageIncrease = warehouse ? warehouse.baseStorageIncrease : 0;

    const caps = {
        wood: gameState.baseStorage.wood + (warehouseLevel * warehouseStorageIncrease),
        stone: gameState.baseStorage.stone + (warehouseLevel * warehouseStorageIncrease),
        food: gameState.baseStorage.food + (warehouseLevel * warehouseStorageIncrease)
    };

    for(const resource in gameState.resources) {
        const amountElement = document.getElementById(`${resource}`);
        if(amountElement) amountElement.textContent = Math.floor(gameState.resources[resource]);

        if(caps[resource] !== undefined) {
            const capElement = document.getElementById(`${resource}-cap`);
            if(capElement) capElement.textContent = caps[resource];
        }
    }

    for(const buildingName in gameState.buildings) updateBuildingUI(buildingName);
};
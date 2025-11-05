import { gameState } from './state.js';

export const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const showMessage = (msg, type) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;

    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
};

function updateSharedUI() {
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
    for (const resource in gameState.resources) {
        const amountElement = document.getElementById(`${resource}`);
        if (amountElement) amountElement.textContent = Math.floor(gameState.resources[resource]);
        if (caps[resource] !== undefined) {
            const capElement = document.getElementById(`${resource}-cap`);
            if (capElement) capElement.textContent = caps[resource];
        }
    }
}

function renderBuildings() {
    const container = document.getElementById('building-list');
    if (!container) return;
    container.innerHTML = '';
    const meta = gameState.buildingMeta;
    const isBuilderBusy = gameState.constructionQueue.length > 0;
    for (const type in gameState.buildings) {
        const instances = gameState.buildings[type];
        const typeMeta = meta[type];
        const constructionJobForType = gameState.constructionQueue.find(job => job.buildingType === type);
        const typeContainer = document.createElement('div');
        typeContainer.className = 'building-type-container';
        typeContainer.innerHTML = `<h3>${typeMeta.name} (${instances.length}/${typeMeta.maxInstances})</h3>`;
        instances.forEach((building, index) => {
            const buildingDiv = document.createElement('div');
            buildingDiv.className = 'building';
            let statusHTML = '';
            let buttonHTML = '';
            const isThisBuildingConstructing = constructionJobForType && constructionJobForType.index === index;
            if (isThisBuildingConstructing) {
                const timeLeft = Math.ceil((constructionJobForType.finishTime - Date.now()) / 1000);
                statusHTML = `<p class="cost" style="font-weight: bold;">Remaining time: ${timeLeft > 0 ? timeLeft : 0}s</p>`;
                buttonHTML = `<button class="upgrade-button" disabled>Upgrading...</button>`;
            } else if (building.level >= typeMeta.maxLevel) {
                statusHTML = `<p class="cost" style="font-weight: bold;">Maximum level reached</p>`;
                buttonHTML = `<button class="upgrade-button" disabled>Max Level</button>`;
            } else {
                const nextCost = {};
                for (const resource in typeMeta.cost) {
                    nextCost[resource] = Math.floor(typeMeta.cost[resource] * Math.pow(1.5, building.level));
                }
                const costString = Object.keys(nextCost).map(resKey => `${capitalizeFirstLetter(resKey)}: ${nextCost[resKey]}`).join(', ');
                statusHTML = `<p class="cost">Cost: ${costString}</p>`;
                buttonHTML = `<button class="upgrade-button" data-type="${type}" data-index="${index}" ${isBuilderBusy ? 'disabled' : ''}>Upgrade</button>`;
            }
            let descriptionText = '';
            if (typeMeta.baseProduction) {
                const resourceType = type === 'lumberyard' ? 'wood' : (type === 'quarry' ? 'stone' : 'food');
                descriptionText = `<p>Production: +${building.level * typeMeta.baseProduction} ${capitalizeFirstLetter(resourceType)} / sec</p>`;
            } else {
                if (typeMeta.storageBonus) {
                    descriptionText += `<p>Storage Bonus: +${building.level * typeMeta.storageBonus} per resource</p>`;
                }
                if (typeMeta.constructionTimeReduction) {
                    descriptionText += `<p>Build Time Reduction: -${(building.level * typeMeta.constructionTimeReduction * 100).toFixed(0)}%</p>`;
                }
            }
            buildingDiv.innerHTML = `<p>${typeMeta.name} #${index + 1} (Level: ${building.level})</p>${descriptionText}${buttonHTML}${statusHTML}`;
            typeContainer.appendChild(buildingDiv);
        });
        if (instances.length < typeMeta.maxInstances) {
            const addButton = document.createElement('button');
            addButton.className = 'add-building-button';
            addButton.textContent = `Build New ${typeMeta.name}`;
            addButton.dataset.type = type;
            if (isBuilderBusy) {
                addButton.disabled = true;
            }
            typeContainer.appendChild(addButton);
        }
        container.appendChild(typeContainer);
    }
}

export const updateDisplay = () => {
    updateSharedUI();
    renderBuildings();
};
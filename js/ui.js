import { gameState } from './state.js';

export const capitalizeLetter = (string) => {
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

/**
 * ÚJ: Ez az egyetlen függvény felel az összes épület felületének dinamikus felépítéséért.
 */
const renderBuildings = () => {
    const container = document.getElementById('building-list');
    if(!container) return;

    container.innerHTML = ''; // Konténer kiürítése minden frissítéskor

    const meta = gameState.buildingMeta;
    const isBuilderBusy = gameState.constructionQueue.length > 0;

    for(const type in gameState.buildings) {
        const instances = gameState.buildings[type];
        const typeMeta = meta[type];
        const constructionJob = gameState.constructionQueue.find(job => job.buildingType === type);

        const typeContainer = document.createElement('div');
        typeContainer.className = 'building-type-container';
        typeContainer.innerHTML = `<h3>${typeMeta.name} (${instances.length}/${typeMeta.maxInstances})</h3>`;

        instances.forEach((building, index) => {
            const buildingDiv = document.createElement('div');
            buildingDiv.className = 'building';

            let statusHTML = '';
            let buttonHTML = '';

            // 1. ESET - Az épület éppen fejlesztés alatt áll
            if(constructionJob && constructionJob.index === index) {
                const timeLeft = Math.ceil((constructionJob.finishTime - Date.now()) / 1000);
                statusHTML = `<p class="cost" style="font-weight: bold;">Remaining time: ${timeLeft > 0 ? timeLeft : 0}s</p>`;
                buttonHTML = `<button class="upgrade-button" disabled>Upgrading...</button>`;
            }

            // 2. ESET: Az épület elérte a maximum szintet
            else if(building.level >= typeMeta.maxLevel) {
                statusHTML = `<p class="cost" style="font-weight: bold;">Maximum level reached</p>`;
                buttonHTML = `<button class="upgrade-button" disabled>Max Level</button>`;
            }

            // 3. ESET: Fejleszthető (de az építő lehet foglalt)
            else {
                const nextCost = {};
                for(const resource in typeMeta.cost) nextCost[resource] = Math.floor(typeMeta.cost[resource] * Math.pow(1.5, building.level));
                const costString = Object.keys(nextCost).map(resKey => `${capitalizeLetter(resKey)}: ${nextCost[resKey]}`).join(', ');
                statusHTML = `<p class="cost">Cost: ${costString}</p>`;
                buttonHTML = `
                    <button class="upgrade-button" data-type="${type}" data-index="${index}" ${isBuilderBusy ? "disabled" : ""}>Upgrade</button>
                `;
            }

            const productionText = typeMeta.baseProduction 
                ? `<p>Production: ${building.level * typeMeta.baseProduction}
                    ${capitalizeLetter(type === 'lumberyard' ? 'wood' : (type === 'quarry' ? 'stone' : 'food'))}/sec</p>`
                : '';

            buildingDiv.innerHTML = `
                <p>${typeMeta.name} #${index + 1} (Level: ${building.level})</p>
                ${productionText}
                ${buttonHTML}
                ${statusHTML}
            `;
            typeContainer.appendChild(buildingDiv);
        });

        // Új építés gomb hozzáadása (amennyiben még lehet építeni)
        if(instances.length < typeMeta.maxInstances) {
            const buildButton = document.createElement('button');
            buildButton.className = 'build-building-button';
            buildButton.textContent = `Build New ${typeMeta.name}`;
            buildButton.dataset.type = type;
            // Ha az építő foglalt, letiltjuk a gombot
            if(isBuilderBusy) buildButton.disabled = true;

            typeContainer.appendChild(buildButton);
        }

        container.appendChild(typeContainer);
    }
};

export const updateDisplay = () => {
    // Nyersanyagok és kapacitás frissítése
    const warehouseMeta = gameState.buildingMeta.warehouse;
    let totalWarehouseLevel = 0;
    gameState.buildings.warehouse.forEach(w => totalWarehouseLevel += w.level);

    const caps = {
        wood: gameState.baseStorage.wood + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease),
        stone: gameState.baseStorage.stone + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease),
        food: gameState.baseStorage.food + (totalWarehouseLevel * warehouseMeta.baseStorageIncrease)
    };

    for(const resource in gameState.resources) {
        const amountElement = document.getElementById(`${resource}`);
        if(amountElement) amountElement.textContent = Math.floor(gameState.resources[resource]);

        if(caps[resource] !== undefined) {
            const capElement = document.getElementById(`${resource}-cap`);
            if(capElement) capElement.textContent = caps[resource];
        }
    }

    // A teljes épületlista újrarajzolása
    renderBuildings();
};
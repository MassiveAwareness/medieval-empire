// =================================================================
// JÁTÉK ÁLLAPOT (GAME STATE)
// Ebben az egyetlen objektumban tárolunk minden fontos adatot.
// =================================================================
let gameState = {
    resources: {
        wood: 50,
        stone: 20,
        food: 100,
        gold: 0,
        sapphire: 0
    },
    buildings: {
        lumberyard: {
            level: 0,
            baseProduction: 1, // Ennyit termel szintenként
            cost: { wood: 10 } // A fejlesztés alap költsége
        },
        quarry: {
            level: 0,
            baseProduction: 1,
            cost: { stone: 10, wood: 5 } // Kőbe és fába is kerül
        },
        farm: {
            level: 0,
            baseProduction: 2,
            cost: { wood: 10, stone: 5 }
        }
    }
};

// =================================================================
// DOM ELEMEK ÉS ESEMÉNYKEZELŐK
// =================================================================

// Üzenet panel elérése
const messageTextEl = document.getElementById('message-text');

// Gombok eseménykezelőinek hozzárendelése
document.getElementById('upgrade-lumberyard').addEventListener('click', () => upgradeBuilding('lumberyard'));
document.getElementById('upgrade-quarry').addEventListener('click', () => upgradeBuilding('quarry'));
document.getElementById('upgrade-farm').addEventListener('click', () => upgradeBuilding('farm'));

// ÚJ: Művelet gombok
document.getElementById('save-button').addEventListener('click', saveGame);
document.getElementById('reset-button').addEventListener('click', resetGame);


// =================================================================
// JÁTÉK LOGIKA FUNKCIÓK
// =================================================================

/**
 * Fejleszt egy épületet a neve alapján.
 * @param {string} buildingName - Az épület kulcsa a gameState-ben (pl. 'lumberyard').
 */
function upgradeBuilding(buildingName) {
    const building = gameState.buildings[buildingName];
    const currentLevel = building.level;

    // Költség kiszámítása a következő szintre.
    // A Math.pow(1.5, currentLevel) biztosítja a növekvő költségeket.
    const cost = {};
    for (const resource in building.cost) {
        cost[resource] = Math.floor(building.cost[resource] * Math.pow(1.5, currentLevel));
    }

    // Ellenőrzés: megengedheti-e a játékos a fejlesztést?
    let canAfford = true;
    for (const resource in cost) {
        if (gameState.resources[resource] < cost[resource]) {
            canAfford = false;
            break; // Ha egyből hiányzik, felesleges tovább ellenőrizni.
        }
    }

    if (canAfford) {
        // Ha igen, vonjuk le a költségeket.
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        
        // Növeljük az épület szintjét.
        building.level++;
        showMessage(`Building upgraded: ${buildingName} to level ${building.level}!`, 'success');
    } else {
        // Ha nem, küldünk egy hibaüzenetet.
        showMessage('Insufficient material!', 'error');
    }
    
    // Minden fejlesztési kísérlet után frissítjük a kijelzőt.
    updateDisplay();
}

/**
 * Üzenetet jelenít meg a felhasználói felületen.
 * @param {string} msg - A megjelenítendő üzenet.
 * @param {'success'|'error'} type - Az üzenet típusa (a színezéshez).
 */
function showMessage(msg, type) {
    messageTextEl.textContent = msg;
    // A szín beállítása a típus alapján a jobb visszajelzésért.
    messageTextEl.style.color = type === 'error' ? '#D8000C' : '#4F8A10';
}

/**
 * A teljes kijelzőt frissíti a gameState aktuális állapota alapján.
 */
function updateDisplay() {
    // 1. Nyersanyagok kiírásának frissítése
    for (const resource in gameState.resources) {
        const element = document.getElementById(`${resource}`);
        if (element) {
            element.textContent = gameState.resources[resource];
        }
    }

    // 2. Minden épület paneljének frissítése
    for (const buildingName in gameState.buildings) {
        updateBuildingUI(buildingName);
    }
}

/**
 * Frissíti egy konkrét épület paneljét a felhasználói felületen.
 * @param {string} name - Az épület neve/kulcsa.
 */
function updateBuildingUI(name) {
    const building = gameState.buildings[name];
    if (!building) return; // Biztonsági ellenőrzés, ha nem létező épületnevet kapna.

    const currentLevel = building.level;
    
    // Kiszámoljuk a KÖVETKEZŐ szint költségét, hogy a játékos lássa.
    const nextCost = {};
    for (const resource in building.cost) {
        nextCost[resource] = Math.floor(building.cost[resource] * Math.pow(1.5, currentLevel));
    }
    
    // A költség szövegének dinamikus összeállítása (pl. "Fa: 15, Kő: 8")
    const resourceNames = { wood: 'Wood', stone: 'Stone', food: 'Food' };
    const costString = Object.keys(nextCost)
        .map(resKey => `${resourceNames[resKey] || resKey}: ${nextCost[resKey]}`)
        .join(', ');

    // A megfelelő HTML elemek tartalmának frissítése
    document.getElementById(`${name}-level`).textContent = currentLevel;
    document.getElementById(`${name}-production`).textContent = currentLevel * (building.baseProduction * 3600);
    document.getElementById(`${name}-cost`).textContent = costString;
}


// =================================================================
// ÚJ: MENTÉS, BETÖLTÉS, TÖRLÉS FUNKCIÓK
// =================================================================

/**
 * Elmenti a jelenlegi gameState objektumot a böngésző localStorage-ébe.
 */
function saveGame() {
    // A localStorage csak szöveget (string) tud tárolni.
    // A JSON.stringify() a JavaScript objektumunkat szöveggé alakítja.
    localStorage.setItem('gameState', JSON.stringify(gameState));
    showMessage('Game state was successfully saved!', 'success');
}

/**
 * Betölti a játékállást a localStorage-ből, ha létezik.
 */
function loadGame() {
    const savedStateJSON = localStorage.getItem('gameState');

    if(savedStateJSON) {
        // Ha van mentés. visszaalakítjuk objektummá a JSON.parse() segítségével.
        const savedState = JSON.parse(savedStateJSON);

        // Felülírjuk az alapértelmezett gameState-et a mentett állással.
        // Az Object.assign egy biztonságosabb módja, ha később új dolgokat adunk a gameState-hez.
        gameState = Object.assign(gameState, savedState);
        showMessage('Previous save was successfully loaded!', 'success');
    }
}

/**
 * Törli a mentett játékállást és újratölti az oldalt a kezdéshez.
 */
function resetGame() {
    // Kitöröljük a mentett adatot a localStorage-ből.
    localStorage.removeItem('gameState');
    showMessage(`Saved game state deleted! Game resets...`, 'success');

    // Várunk egy kicsit, hogy a játékos elolvashassa az üzenetet, majd újratöltjük az oldalt.
    setTimeout(() => {
        location.reload();
    }, 3000);
}


// =================================================================
// JÁTÉK HUROK (GAME LOOP)
// =================================================================

/**
 * A játék fő ciklusa, ami másodpercenként lefut.
 */
function gameLoop() {
    // Nyersanyagok hozzáadása a termelés alapján.
    for (const buildingName in gameState.buildings) {
        const building = gameState.buildings[buildingName];
        if (building.level > 0) {
            // A favágó fát termel, a bánya követ, stb.
            // Ez a rugalmas megoldás akkor is működik, ha új nyersanyag/épület párost hozunk létre.
            if (buildingName === 'lumberyard') {
                 gameState.resources.wood += building.level * building.baseProduction;
            } else if (buildingName === 'quarry') {
                 gameState.resources.stone += building.level * building.baseProduction;
            } else if (buildingName === 'farm') {
                 gameState.resources.food += building.level * building.baseProduction;
            }
        }
    }

    // A kijelző frissítése minden ciklus végén.
    updateDisplay();
}


// =================================================================
// A JÁTÉK INDÍTÁSA
// =================================================================

// 1. LÉPÉS: BETÖLTÉS!
// Mielőtt bármi történik, megpróbáljuk betölteni a mentett állást.
loadGame();

// 2. LÉPÉS: A felület frissítése a betöltött (vagy alapértelmezett) adatokkal.
updateDisplay();

// 3. LÉPÉS: A game loop elindítása.
setInterval(gameLoop, 100);
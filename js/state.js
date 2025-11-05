export let gameState = {
    baseStorage: { wood: 1500, stone: 1500, food: 1500 },
    resources: { wood: 150, stone: 75, food: 250, gold: 1000, sapphire: 60 },
    // --- TELJESEN ÚJ STRUKTÚRA ---
    buildings: {
        lumberyard: [
            { level: 1 }
        ],
        quarry: [
            { level: 1 }
        ],
        farm: [
            { level: 1 }
        ],
        warehouse: [
            { level: 1 }
        ],
    },
    // ÚJ: Itt definiáljuk az épületek "meta" adatait, amik nem változnak
    buildingMeta: {
        lumberyard: {
            name: 'Lumberyard',
            baseProduction: 1,
            cost: { wood: 25 },
            baseConstructionTime: 5,
            maxLevel: 10,
            maxInstances: 3
        },
        quarry: {
            name: 'Quarry',
            baseProduction: 1,
            cost: { wood: 40, stone: 20 },
            baseConstructionTime: 8,
            maxLevel: 10,
            maxInstances: 3
        },
        farm: {
            name: 'Farm',
            baseProduction: 2,
            cost: { wood: 30, stone: 10 },
            baseConstructionTime: 6,
            maxLevel: 10,
            maxInstances: 3
        },
        warehouse: {
            name: 'Warehouse',
            baseStorageIncrease: 500,
            cost: { wood: 100, stone: 50 },
            baseConstructionTime: 15,
            maxLevel: 10,
            maxInstances: 1
        },
    },
    constructionQueue: []
};

export const setGameState = (newState) => {
    gameState = newState;
};
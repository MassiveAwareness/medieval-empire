export let gameState = {
    // ÚJ: Alap tárolókapacitás. Ez a 0. szintű raktár értéke.
    baseStorage: {
        wood: 500,
        stone: 500,
        food: 500
    },
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
            baseProduction: 1,
            cost: { wood: 10 },
            baseConstructionTime: 5
        },
        quarry: {
            level: 0,
            baseProduction: 1,
            cost: { stone: 10, wood: 5 },
            baseConstructionTime: 8
        },
        farm: {
            level: 0,
            baseProduction: 2,
            cost: { wood: 10, stone: 5 },
            baseConstructionTime: 6
        },
        // ÚJ: Raktár épület hozzáadása
        warehouse: {
            level: 1, // Alapból 1-es szintű, hogy legyen alap kapacitás
            baseStorageIncrease: 500, // Szintenként ennyivel növeli a kapacitást
            cost: { wood: 100, stone: 50 },
            baseConstructionTime: 15
        }
    },
    constructionQueue: []
};

export const setGameState = (newState) => {
    gameState = newState;
};
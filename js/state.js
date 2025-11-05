export let gameState = {
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
            maxLevel: 10,
            baseProduction: 1,
            cost: { wood: 10 },
            baseConstructionTime: 5
        },
        quarry: {
            level: 0,
            maxLevel: 10,
            baseProduction: 1,
            cost: { stone: 10, wood: 5 },
            baseConstructionTime: 8
        },
        farm: {
            level: 0,
            maxLevel: 10,
            baseProduction: 2,
            cost: { wood: 10, stone: 5 },
            baseConstructionTime: 6
        },
        warehouse: {
            level: 1,
            maxLevel: 10,
            baseStorageIncrease: 500,
            cost: { wood: 100, stone: 50 },
            baseConstructionTime: 15
        }
    },
    constructionQueue: []
};

export const setGameState = (newState) => {
    gameState = newState;
};
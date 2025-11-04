export let gameState = {
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
        }
    },
    constructionQueue: []
};

export const setGameState = (newState) => {
    gameState = newState;
};
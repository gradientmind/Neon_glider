/**
 * LevelConfig - Game level definitions and progression thresholds
 */

export const LEVEL_CONFIG = [
    {
        id: 1,
        name: "DRIFT",
        color: '#4ade80', // Green
        bgGradient: ['#0f172a', '#022c22'],
        speed: 3.5,
        gap: 220,
        gravity: 0.25,
        jump: -5.5,
        movePipe: false
    },
    {
        id: 2,
        name: "RUSH",
        color: '#818cf8', // Indigo
        bgGradient: ['#1e1b4b', '#312e81'],
        speed: 5,
        gap: 190,
        gravity: 0.3,
        jump: -6.5,
        movePipe: false
    },
    {
        id: 3,
        name: "HYPER",
        color: '#f472b6', // Pink
        bgGradient: ['#3f0c28', '#831843'],
        speed: 6.5,
        gap: 175,
        gravity: 0.38,
        jump: -7,
        movePipe: true
    },
    {
        id: 4,
        name: "VOID",
        color: '#ef4444', // Red
        bgGradient: ['#000000', '#450a0a'],
        speed: 8,
        gap: 160,
        gravity: 0.5,
        jump: -8,
        movePipe: true
    },
    {
        id: 5,
        name: "PLASMA",
        color: '#f59e0b', // Amber/Orange
        bgGradient: ['#451a03', '#78350f'],
        speed: 9.5,
        gap: 150,
        gravity: 0.6,
        jump: -9,
        movePipe: true
    },
    {
        id: 6,
        name: "QUANTUM",
        color: '#06b6d4', // Cyan
        bgGradient: ['#083344', '#155e75'],
        speed: 11,
        gap: 145,
        gravity: 0.7,
        jump: -10,
        movePipe: true
    },
    {
        id: 7,
        name: "OMEGA",
        color: '#ffffff', // White
        bgGradient: ['#171717', '#404040'],
        speed: 13,
        gap: 140,
        gravity: 0.85,
        jump: -11,
        movePipe: true
    }
];

// Score thresholds for level progression
export const LEVEL_THRESHOLDS = [
    { level: 1, minScore: 8 },   // RUSH
    { level: 2, minScore: 20 },  // HYPER
    { level: 3, minScore: 40 },  // VOID
    { level: 4, minScore: 60 },  // PLASMA
    { level: 5, minScore: 90 },  // QUANTUM
    { level: 6, minScore: 120 }  // OMEGA
];

/**
 * Get the level index based on current score
 * @param {number} score - Current game score
 * @returns {number} Level index (0-6)
 */
export function getLevelForScore(score) {
    let levelIdx = 0;
    for (const threshold of LEVEL_THRESHOLDS) {
        if (score >= threshold.minScore) {
            levelIdx = threshold.level;
        }
    }
    return levelIdx;
}

/**
 * Get level configuration by index
 * @param {number} index - Level index
 * @returns {Object} Level configuration
 */
export function getLevelConfig(index) {
    return LEVEL_CONFIG[Math.min(index, LEVEL_CONFIG.length - 1)];
}

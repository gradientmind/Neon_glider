/**
 * NeonGlider - Main Entry Point
 * 
 * A modern, modular canvas-based space game
 */

import { GameEngine } from './core/GameEngine.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new GameEngine('gameCanvas');

    // Expose to window for debugging (optional, remove in production)
    if (typeof window !== 'undefined') {
        window.neonGliderGame = game;
    }

    console.log('🚀 NeonGlider initialized');
});

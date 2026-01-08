/**
 * ScoreManager - Score tracking and persistence
 */

const STORAGE_KEY = 'neonGlideHighScore';

export class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = this._loadHighScore();
    }

    /**
     * Load high score from localStorage
     * @private
     * @returns {number}
     */
    _loadHighScore() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    }

    /**
     * Save high score to localStorage
     * @private
     */
    _saveHighScore() {
        localStorage.setItem(STORAGE_KEY, this.highScore.toString());
    }

    /**
     * Reset current score
     */
    reset() {
        this.score = 0;
    }

    /**
     * Add points to score
     * @param {number} points - Points to add
     * @returns {number} New score
     */
    addPoints(points = 1) {
        this.score += points;
        return this.score;
    }

    /**
     * Get current score
     * @returns {number}
     */
    getScore() {
        return this.score;
    }

    /**
     * Get high score
     * @returns {number}
     */
    getHighScore() {
        return this.highScore;
    }

    /**
     * Check and update high score if current score is higher
     * @returns {boolean} True if new high score
     */
    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this._saveHighScore();
            return true;
        }
        return false;
    }
}

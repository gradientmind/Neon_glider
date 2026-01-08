/**
 * Entity - Base class for all game objects
 */

export class Entity {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.active = true;
    }

    /**
     * Update entity state
     * @param {number} dt - Delta time (normalized to 60fps)
     */
    update(dt) {
        // Override in subclass
    }

    /**
     * Render entity
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // Override in subclass
    }

    /**
     * Reset entity to initial state
     */
    reset() {
        // Override in subclass
    }

    /**
     * Get bounding box for collision detection
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

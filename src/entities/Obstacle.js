/**
 * Obstacle - Pipe obstacles with spawning, movement, and collision detection
 */

import { EventBus, Events } from '../core/EventBus.js';
import { getLevelConfig } from '../config/LevelConfig.js';

export class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.list = [];
        this.spawnTimer = 0;
        this.currentLevelIdx = 0;
        this.frames = 0;
    }

    /**
     * Set current level for configuration
     * @param {number} levelIdx - Current level index
     */
    setLevel(levelIdx) {
        this.currentLevelIdx = levelIdx;
    }

    /**
     * Reset all obstacles
     */
    reset() {
        this.list = [];
        this.spawnTimer = 0;
        this.frames = 0;
    }

    /**
     * Spawn a new obstacle
     */
    spawn() {
        const config = getLevelConfig(this.currentLevelIdx);
        const minHeight = 50;
        const maxPos = this.canvas.height - minHeight - config.gap;
        const minPos = minHeight;
        const topHeight = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos;

        this.list.push({
            x: this.canvas.width,
            y: topHeight,
            gap: config.gap,
            width: 60,
            passed: false,
            moving: config.movePipe,
            moveOffset: Math.random() * Math.PI * 2,
            baseY: topHeight
        });
    }

    /**
     * Update all obstacles
     * @param {number} dt - Delta time
     * @param {Object} playerHitbox - Player hitbox for collision
     * @param {number} playerX - Player X position for scoring
     */
    update(dt, playerHitbox, playerX) {
        const config = getLevelConfig(this.currentLevelIdx);
        this.frames++;

        // Consistent spawning regardless of speed
        this.spawnTimer += dt;
        const distanceBetweenPipes = 350;
        const timeThreshold = distanceBetweenPipes / config.speed;

        if (this.spawnTimer > timeThreshold) {
            this.spawnTimer = 0;
            this.spawn();
        }

        // Move & Collision
        for (let i = this.list.length - 1; i >= 0; i--) {
            const p = this.list[i];
            p.x -= config.speed * dt;

            // Vertical Oscillation (Level 3+)
            if (p.moving) {
                const oscillationSpeed = this.currentLevelIdx >= 5 ? 0.08 :
                    (this.currentLevelIdx === 3 ? 0.03 : 0.05);
                const amplitude = this.currentLevelIdx >= 5 ? 120 :
                    (this.currentLevelIdx === 3 ? 60 : 100);
                p.y = p.baseY + Math.sin(this.frames * oscillationSpeed + p.moveOffset) * amplitude;

                // Safety clamp to keep gap onscreen
                const margin = 30;
                if (p.y < margin) p.y = margin;
                if (p.y > this.canvas.height - p.gap - margin) {
                    p.y = this.canvas.height - p.gap - margin;
                }
            }

            // Collision Detection with player hitbox
            if (playerHitbox) {
                // Top Pipe collision
                if (
                    playerHitbox.x < p.x + p.width &&
                    playerHitbox.x + playerHitbox.width > p.x &&
                    playerHitbox.y < p.y
                ) {
                    EventBus.emit(Events.PLAYER_COLLIDE, { type: 'obstacle', pipe: p });
                }

                // Bottom Pipe collision
                if (
                    playerHitbox.x < p.x + p.width &&
                    playerHitbox.x + playerHitbox.width > p.x &&
                    playerHitbox.y + playerHitbox.height > p.y + p.gap
                ) {
                    EventBus.emit(Events.PLAYER_COLLIDE, { type: 'obstacle', pipe: p });
                }
            }

            // Score Update
            if (p.x + p.width < playerX && !p.passed) {
                p.passed = true;
                EventBus.emit(Events.SCORE_UPDATE, { increment: 1 });
            }

            // Remove off-screen
            if (p.x < -100) {
                this.list.splice(i, 1);
            }
        }
    }

    /**
     * Render all obstacles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const config = getLevelConfig(this.currentLevelIdx);
        ctx.lineWidth = 3;
        ctx.strokeStyle = config.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = config.color;

        for (const p of this.list) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';

            // Top Pipe
            ctx.beginPath();
            ctx.roundRect(p.x, -100, p.width, p.y + 100, [0, 0, 8, 8]);
            ctx.fill();
            ctx.stroke();

            // Bottom Pipe
            ctx.beginPath();
            ctx.roundRect(p.x, p.y + p.gap, p.width, this.canvas.height + 100, [8, 8, 0, 0]);
            ctx.fill();
            ctx.stroke();

            // Tech Details inside pipes
            ctx.fillStyle = config.color;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(p.x + 10, p.y - 30, 40, 6);
            ctx.fillRect(p.x + 10, p.y - 15, 40, 6);
            ctx.fillRect(p.x + 10, p.y + p.gap + 10, 40, 6);
            ctx.fillRect(p.x + 10, p.y + p.gap + 25, 40, 6);
            ctx.globalAlpha = 1.0;
        }
        ctx.shadowBlur = 0;
    }
}

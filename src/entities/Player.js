/**
 * Player - Spaceship entity with physics, trail, and rendering
 */

import { Entity } from './Entity.js';
import { EventBus, Events } from '../core/EventBus.js';
import { getLevelConfig } from '../config/LevelConfig.js';

export class Player extends Entity {
    constructor(canvas) {
        super(50, 150);
        this.canvas = canvas;
        this.width = 30;
        this.height = 20;
        this.velocity = 0;
        this.rotation = 0;
        this.trail = [];
        this.frames = 0;
        this.currentLevelIdx = 0;
    }

    /**
     * Reset player to starting position
     */
    reset() {
        this.x = this.canvas.width * 0.15;
        this.y = this.canvas.height / 2;
        this.velocity = 0;
        this.rotation = 0;
        this.trail = [];
        this.frames = 0;
    }

    /**
     * Set current level for physics configuration
     * @param {number} levelIdx - Current level index
     */
    setLevel(levelIdx) {
        this.currentLevelIdx = levelIdx;
    }

    /**
     * Update player physics and state
     * @param {number} dt - Delta time
     */
    update(dt) {
        const config = getLevelConfig(this.currentLevelIdx);
        this.frames++;

        // Physics - gravity and velocity
        this.velocity += config.gravity * dt;
        this.y += this.velocity * dt;

        // Rotation calculation based on velocity
        const targetRotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 3, (this.velocity * 0.08)));
        this.rotation += (targetRotation - this.rotation) * 0.15 * dt;

        // Floor/Ceiling Collision
        if (this.y + this.height / 2 >= this.canvas.height || this.y - this.height / 2 <= 0) {
            EventBus.emit(Events.PLAYER_COLLIDE, { type: 'boundary' });
        }

        // Update Trail
        if (this.frames % 2 === 0) {
            const cos = Math.cos(this.rotation);
            const sin = Math.sin(this.rotation);
            const tx = this.x - cos * 20;
            const ty = this.y - sin * 20;

            this.trail.push({ x: tx, y: ty });
            if (this.trail.length > 20) this.trail.shift();
        }
    }

    /**
     * Apply jump impulse
     */
    jump() {
        const config = getLevelConfig(this.currentLevelIdx);
        this.velocity = config.jump;
        EventBus.emit(Events.PLAYER_JUMP, {
            x: this.x - 20,
            y: this.y,
            color: config.color
        });
    }

    /**
     * Get hitbox for collision detection (smaller than visual for forgiveness)
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getHitbox() {
        return {
            x: this.x - 8,
            y: this.y - 6,
            width: 16,
            height: 12
        };
    }

    /**
     * Render player and trail
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const config = getLevelConfig(this.currentLevelIdx);
        const color = config.color;

        // Draw Engine Trail
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = 0; i < this.trail.length - 1; i++) {
            const p1 = this.trail[i];
            const p2 = this.trail[i + 1];
            const alpha = (i / this.trail.length) * 0.6;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1 + (i / this.trail.length) * 6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
        ctx.restore();

        // Draw Spaceship
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Dynamic Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;

        // Main Fuselage
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(20, 0);    // Nose
        ctx.lineTo(-10, 8);   // Right body
        ctx.lineTo(-15, 15);  // Right Wing tip
        ctx.lineTo(-15, 5);   // Right Engine inlet
        ctx.lineTo(-20, 0);   // Rear Center
        ctx.lineTo(-15, -5);  // Left Engine inlet
        ctx.lineTo(-15, -15); // Left Wing tip
        ctx.lineTo(-10, -8);  // Left body
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Engine Thrusters (Visual)
        ctx.shadowBlur = 0;
        ctx.fillStyle = color;

        // Top thruster
        ctx.beginPath();
        ctx.moveTo(-15, 5);
        ctx.lineTo(-22 - (Math.random() * 4), 5); // Flicker
        ctx.lineTo(-15, 8);
        ctx.fill();

        // Bottom thruster
        ctx.beginPath();
        ctx.moveTo(-15, -5);
        ctx.lineTo(-22 - (Math.random() * 4), -5); // Flicker
        ctx.lineTo(-15, -8);
        ctx.fill();

        ctx.restore();
    }
}

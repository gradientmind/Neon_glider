/**
 * ParticleSystem - Particle creation, pooling, and rendering
 */

const MAX_PARTICLES = 200;

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    /**
     * Create particles at a position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of particles
     * @param {string} color - Particle color
     * @param {number} speedMulti - Speed multiplier
     */
    create(x, y, count, color, speedMulti = 1) {
        for (let i = 0; i < count; i++) {
            // Recycle old particles if at max
            if (this.particles.length >= MAX_PARTICLES) {
                const oldest = this.particles.shift();
                this._initParticle(oldest, x, y, color, speedMulti);
                this.particles.push(oldest);
            } else {
                const particle = {};
                this._initParticle(particle, x, y, color, speedMulti);
                this.particles.push(particle);
            }
        }
    }

    /**
     * Initialize a particle with properties
     * @private
     */
    _initParticle(particle, x, y, color, speedMulti) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 * speedMulti;

        particle.x = x;
        particle.y = y;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particle.life = 1.0;
        particle.color = color;
        particle.size = Math.random() * 3 + 1;
    }

    /**
     * Create jump particles
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Level color
     */
    createJumpBurst(x, y, color) {
        this.create(x, y, 8, '#ffffff', 1.5);
        this.create(x, y, 5, color, 2);
    }

    /**
     * Create explosion particles
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Level color
     */
    createExplosion(x, y, color) {
        this.create(x, y, 40, color, 4);
        this.create(x, y, 30, '#ffffff', 2);
        this.create(x, y, 20, '#ffaa00', 3);
    }

    /**
     * Update and render all particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    updateAndDraw(ctx) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    /**
     * Check if there are active particles
     * @returns {boolean}
     */
    hasActiveParticles() {
        return this.particles.length > 0;
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
}

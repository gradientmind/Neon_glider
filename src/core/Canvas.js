/**
 * Canvas - Encapsulated canvas management with auto-resize
 */

export class Canvas {
    constructor(canvasId) {
        this.element = document.getElementById(canvasId);
        if (!this.element) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }

        this._ctx = this.element.getContext('2d', { alpha: false });

        // Bind resize handler
        this._resizeHandler = this.resize.bind(this);
        window.addEventListener('resize', this._resizeHandler);

        // Initial resize
        this.resize();
    }

    /**
     * Get the 2D rendering context
     */
    get ctx() {
        return this._ctx;
    }

    /**
     * Get canvas width
     */
    get width() {
        return this.element.width;
    }

    /**
     * Get canvas height
     */
    get height() {
        return this.element.height;
    }

    /**
     * Resize canvas to fill window
     */
    resize() {
        this.element.width = window.innerWidth;
        this.element.height = window.innerHeight;
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this._ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        window.removeEventListener('resize', this._resizeHandler);
    }
}

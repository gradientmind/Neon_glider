/**
 * InputManager - Unified keyboard, mouse, and touch input handling
 */

import { EventBus } from '../core/EventBus.js';

export class InputManager {
    constructor() {
        this.enabled = true;
        this.onAction = null; // Callback for input action

        this._keyHandler = this._handleInput.bind(this);
        this._touchHandler = this._handleInput.bind(this);
        this._mouseHandler = this._handleInput.bind(this);

        window.addEventListener('keydown', this._keyHandler);
        window.addEventListener('touchstart', this._touchHandler, { passive: false });
        window.addEventListener('mousedown', this._mouseHandler);
    }

    /**
     * Set the action callback
     * @param {Function} callback - Function to call on valid input
     */
    setActionCallback(callback) {
        this.onAction = callback;
    }

    /**
     * Enable or disable input handling
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Handle input events
     * @private
     */
    _handleInput(e) {
        if (!this.enabled) return;

        // Only respond to spacebar for keyboard
        if (e.type === 'keydown' && e.code !== 'Space') return;

        // Ignore clicks on buttons
        if (e.target.closest('button')) return;

        // Prevent zoom/scroll on touch
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        if (this.onAction) {
            this.onAction(e);
        }
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        window.removeEventListener('keydown', this._keyHandler);
        window.removeEventListener('touchstart', this._touchHandler);
        window.removeEventListener('mousedown', this._mouseHandler);
    }
}

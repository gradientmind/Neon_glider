/**
 * EventBus - Pub/Sub system for decoupled communication between modules
 */

const listeners = new Map();

export const EventBus = {
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    on(event, callback) {
        if (!listeners.has(event)) {
            listeners.set(event, new Set());
        }
        listeners.get(event).add(callback);
    },

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler to remove
     */
    off(event, callback) {
        if (listeners.has(event)) {
            listeners.get(event).delete(callback);
        }
    },

    /**
     * Emit an event to all subscribers
     * @param {string} event - Event name
     * @param {*} data - Data to pass to handlers
     */
    emit(event, data) {
        if (listeners.has(event)) {
            listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`EventBus error in "${event}" handler:`, error);
                }
            });
        }
    },

    /**
     * Remove all listeners for an event (or all events if no event specified)
     * @param {string} [event] - Optional event name
     */
    clear(event) {
        if (event) {
            listeners.delete(event);
        } else {
            listeners.clear();
        }
    }
};

// Event name constants for type safety
export const Events = {
    GAME_START: 'game:start',
    GAME_OVER: 'game:over',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    SCORE_UPDATE: 'score:update',
    LEVEL_CHANGE: 'level:change',
    PLAYER_JUMP: 'player:jump',
    PLAYER_COLLIDE: 'player:collide'
};

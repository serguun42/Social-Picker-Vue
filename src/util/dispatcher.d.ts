export default Dispatcher;
declare namespace Dispatcher {
    const _listeners: {
        [eventName: string]: Function[];
    };
    /**
     * Add callback for certain event
     *
     * @param {string} eventName
     * @param {Function} eventHandler
     * @returns {void}
     */
    function link(eventName: string, eventHandler: Function): void;
    /**
     * Add callback for certain event
     *
     * @param {string} eventName
     * @param {Function} eventHandler
     * @returns {void}
     */
    function link(eventName: string, eventHandler: Function): void;
    /**
     * Add callback for any event call
     *
     * @param {(eventName: string, ...argsForHandler: any[]) => void} eventHandler
     * @returns {void}
     */
    function onAny(eventHandler: (eventName: string, ...argsForHandler: any[]) => void): void;
    /**
     * Add callback for any event call
     *
     * @param {(eventName: string, ...argsForHandler: any[]) => void} eventHandler
     * @returns {void}
     */
    function onAny(eventHandler: (eventName: string, ...argsForHandler: any[]) => void): void;
    /**
     * Remove callback (needs **SAME** function) from event call
     *
     * @param {string} eventName
     * @param {Function} eventHandler
     * @returns {void}
     */
    function unlink(eventName: string, eventHandler: Function): void;
    /**
     * Remove callback (needs **SAME** function) from event call
     *
     * @param {string} eventName
     * @param {Function} eventHandler
     * @returns {void}
     */
    function unlink(eventName: string, eventHandler: Function): void;
    /**
     * Clear all listeners for all events (optionally `removeOnAnyToo`) or just for one or for every except excluded.
     *
     * @param {string} [eventName]
     * @param {{exclude?: string[], removeOnAnyToo?: boolean}} [clearingOptions]
     * @returns {void}
     */
    function clear(eventName?: string, clearingOptions?: {
        exclude?: string[];
        removeOnAnyToo?: boolean;
    }): void;
    /**
     * Clear all listeners for all events (optionally `removeOnAnyToo`) or just for one or for every except excluded.
     *
     * @param {string} [eventName]
     * @param {{exclude?: string[], removeOnAnyToo?: boolean}} [clearingOptions]
     * @returns {void}
     */
    function clear(eventName?: string, clearingOptions?: {
        exclude?: string[];
        removeOnAnyToo?: boolean;
    }): void;
    /**
     * Dispatch event – calls every listeners for this event with `...argsForHandler` and `onAny`
     *
     * @param {string} eventName
     * @param {Array} argsForHandler
     * @returns {void}
     */
    function call(eventName: string, ...argsForHandler: any[]): void;
    /**
     * Dispatch event – calls every listeners for this event with `...argsForHandler` and `onAny`
     *
     * @param {string} eventName
     * @param {Array} argsForHandler
     * @returns {void}
     */
    function call(eventName: string, ...argsForHandler: any[]): void;
}

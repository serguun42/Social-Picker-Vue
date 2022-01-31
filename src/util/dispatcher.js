const Dispatcher = {
	/** @type {{[eventName: string]: Function[]}} */
	_listeners: {},

	/**
	 * Add callback for certain event
	 * 
	 * @param {string} eventName
	 * @param {Function} eventHandler
	 * @returns {void}
	 */
	link(eventName, eventHandler) {
		if (!Dispatcher._listeners[eventName]?.length)
			Dispatcher._listeners[eventName] = [];

		Dispatcher._listeners[eventName].push(eventHandler);
	},

	/**
	 * Add callback for any event call
	 * 
	 * @param {(eventName: string, ...argsForHandler: any[]) => void} eventHandler
	 * @returns {void}
	 */
	onAny(eventHandler) {
		if (!Dispatcher._listeners["onAny"]?.length)
			Dispatcher._listeners["onAny"] = [];

		Dispatcher._listeners["onAny"].push(eventHandler);
	},

	/**
	 * Remove callback (needs **SAME** function) from event call
	 * 
	 * @param {string} eventName
	 * @param {Function} eventHandler
	 * @returns {void}
	 */
	unlink(eventName, eventHandler) {
		if (!Dispatcher._listeners[eventName]?.length) return;

		Dispatcher._listeners[eventName] = Dispatcher._listeners[eventName]
										   .filter((filteringHandler) => filteringHandler !== eventHandler);
	},

	/**
	 * Clear all listeners for all events (optionally `removeOnAnyToo`) or just for one or for every except excluded.
	 * 
	 * @param {string} [eventName]
	 * @param {{exclude?: string[], removeOnAnyToo?: boolean}} [clearingOptions]
	 * @returns {void}
	 */
	clear(eventName, clearingOptions) {
		if (eventName) {
			if (eventName === "*") {
				if (!clearingOptions) clearingOptions = {};
				if (!clearingOptions.exclude) clearingOptions.exclude = [];
				if (!clearingOptions.removeOnAnyToo) clearingOptions.exclude.push("onAny");

				for (const key in Dispatcher._listeners) {
					if (!clearingOptions.exclude.includes(key)) {
						delete Dispatcher._listeners[key];
					}
				}
			} else
				Dispatcher._listeners[eventName] = [];
		} else
			Dispatcher._listeners = {};
	},

	/**
	 * Dispatch event – calls every listeners for this event with `...argsForHandler` and `onAny`
	 * 
	 * @param {string} eventName
	 * @param {Array} argsForHandler
	 * @returns {void}
	 */
	call(eventName, ...argsForHandler) {
		if (!Dispatcher._listeners[eventName]?.length)
			Dispatcher._listeners[eventName] = [];

		Dispatcher._listeners[eventName].forEach((eventHandler) => eventHandler(...argsForHandler));

		if (Dispatcher._listeners["onAny"]?.length)
			Dispatcher._listeners["onAny"].forEach((eventHandler) => eventHandler(eventName, ...argsForHandler));
	}
}

export default Dispatcher;

import store from "../store";
import Dispacher from "./dispatcher";
import LogMessageOrError from "./log";

const CACHE_STORAGE_NAME = "social_picker_cache_storage";

/**
 * @param {boolean} showMessage
 * @returns {void}
 */
export const ClearCache = (showMessage) => {
	caches.delete(CACHE_STORAGE_NAME)
	.then(() => {
		if (showMessage)
			store.dispatch("showMessage", store.getters.i18n("cache cleared"));
	})
	.catch((e) => {
		LogMessageOrError(e);

		if (showMessage)
			store.dispatch("showMessage", store.getters.i18n("error while clearing cache"));
	});


	if ("serviceWorker" in navigator)
		navigator.serviceWorker.getRegistrations()
		.then((registered) =>
			registered.forEach((sw) => sw.unregister())
		);
};

Dispacher.link("clearCache", ClearCache);

if ("serviceWorker" in navigator && !IS_DEV)
	navigator.serviceWorker.register("/service-worker.js", { scope: "/" });

window.addEventListener("load", () => {
	fetch("/version.txt")
	.then((res) => {
		if (res.status === 200)
			return res.text();
		else
			Promise.reject(`Status code ${res.status} ${res.statusText}`);
	})
	.then((versionFileContents) => {
		if (versionFileContents.trim() !== process.env.VUE_APP_BUILD_HASH) {
			/**
			 * Clear cache and SW because of build hash difference
			 */
			ClearCache(true);
		}
	})
	.catch(LogMessageOrError);
});


export default {
	ClearCache
};

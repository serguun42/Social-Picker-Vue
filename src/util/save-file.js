import store from "../store";
import { API_METHODS } from "./api";
import { SafeParseURL } from "./check-for-link";
import LogMessageOrError from "./log";

/**
 * Storage of URL to already saved Blobs
 * @type {{ [source: string]: string }}
 */
const BLOB_STORAGE = {};

/**
 * @param {string} source
 * @returns {Promise<string>}
 */
const LocalFetch = (source) => {
	if (BLOB_STORAGE[source]) {
		LogMessageOrError(`${source} existed in BLOB_STORAGE`);
		return Promise.resolve(BLOB_STORAGE[source]);
	}

	const forCors = /redd|insta|danbooru|gelbooru|konachan|yande|shuushuu|kemono/i.test(source);
	if (forCors)
		source = API_METHODS.MediaDownloadURLForCORS(source);

	const cors = (new SafeParseURL(source).origin !== location.origin);

	return fetch(source, {
		method: "GET",
		mode: (cors ? "cors" : "same-origin"),
		credentials: (cors ? "omit" : "same-origin"),
		cache: "no-cache"
	})
	.then((res) => {
		if (res.status !== 200)
			return Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`));

		return res.blob()
		.then((blob) => {
			try {
				const blobObjectURL = URL.createObjectURL(blob);
				BLOB_STORAGE[source] = blobObjectURL;
				return Promise.resolve(blobObjectURL);
			} catch (e) {
				return Promise.reject(e);
			}
		});
	});
}

/**
 * @param {string} source
 * @param {string} filename
 * @param {string} extension
 */
const SaveFile = (source, filename, extension) => {
	LocalFetch(source)
	.then((blobObjectURL) => {
		const anchor = document.createElement("a");
		anchor.style.display = "none";
		anchor.href = blobObjectURL;
		anchor.download = `${filename.replace(/[/\\?%*:|"<>]/g, '-')}.${extension || "jpg"}`;
		document.body.appendChild(anchor);
		try {
			anchor.click();
			store.dispatch("showMessage", store.getters.i18n("saving file"));
		} catch (e) {
			LogMessageOrError(e);
		}
	})
	.catch((e) => {
		LogMessageOrError(e, source);
		store.dispatch("showMessage", store.getters.i18n("cannot save"));
	});
};

export default SaveFile;

import { SafeParseURL } from "./check-for-link";
import LogMessageOrError from "./log"

const API_ROOT = new URL(process.env.VUE_APP_API_ROOT, window.location.origin);
const REQUEST_ROOT = new URL(process.env.VUE_APP_REQUEST_ROOT, window.location.origin);

/**
 * @param {string} method
 * @param {{ [queryName: string]: string | true }} queries
 * @param {URL} [root]
 * @returns {string}
 */
const BuildURL = (method, queries, root = API_ROOT) => {
	try {
		const builtURL = new URL(method, root);

		for (const queryName in queries)
			builtURL.searchParams.set(queryName, queries[queryName]);

		return builtURL.href;
	} catch (e) {
		LogMessageOrError(e);
		return new URL("/api/v1/", location.origin).href;
	}
};

/**
 * @param {string} method
 * @param {{ [queryName: string]: string | true }} [queries]
 * @param {RequestInit & { safeAsBlob: boolean }} [options]
 * @returns {Promise<import("../types").DefaultError>}
 */
export const FetchMethod = (method, queries = {}, options = {}) => {
	delete options.safeAsBlob;

	return fetch(BuildURL(method, queries), options)
	.then((res) => {
		if (options.safeAsBlob) {
			if (res.status !== 200)
				return Promise.reject(`Status code ${res.status} ${res.statusText}`);

			return res.blob();
		}

		try {
			return res.json();
		} catch (e) {
			LogMessageOrError(e);
			return Promise.reject(res.status);
		}
	});
};

/**
 * @returns {Promise<{ success: boolean } & import("../types").DefaultError>}
 */
const AccountCheck = () => FetchMethod("account");

/**
 * @param {string} url
 * @returns {Promise<import("../types").SocialPost & import("../types").DefaultError>}
 */
const MediaPick = (url) => FetchMethod("media/pick", { url });

/**
 * @param {string} filehash
 * @returns {string}
 */
const MediaDownloadURLByFilehash = (filehash) => BuildURL("media/download", { filehash });

/**
 * @param {string} link
 * @returns {string}
 */
const MediaDownloadURLForCORS = (link) => {
	const referer = SafeParseURL(link).origin;

	return BuildURL("", {
		u: link,
		h: JSON.stringify({ referer })
	}, REQUEST_ROOT);
};

export const API_METHODS = {
	AccountCheck,
	MediaPick,
	MediaDownloadURLByFilehash,
	MediaDownloadURLForCORS
};

window.API_METHODS = API_METHODS;

export default {
	API_METHODS,
	FetchMethod
}

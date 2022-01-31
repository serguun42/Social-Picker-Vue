import LOCALES_LIST from "./list.json";

const DEFAULT_LOCALE = "en_US";

/**
 * @returns {string}
 */
const GetBrowserLocale = () => {
	const languageBitsArr = [ ...navigator.languages ].map((language) => language.split(/[^a-z]/i));
	const localesTrimmed = LOCALES_LIST.map((locale) => locale.replace(/\.[\w]+$/, ""));

	const localeScores = localesTrimmed.map((localeFile) => {
		const score = languageBitsArr.map((languageBits) =>
			languageBits.filter((languageBit) => new RegExp(languageBit, "gi").test(localeFile)).length
		).reduce((accum, value) => accum + value, 0);

		return { localeFile, score };
	});

	const bestMatchedLocale = localeScores.sort((prev, next) => next.score - prev.score)?.[0]?.localeFile;

	return bestMatchedLocale || DEFAULT_LOCALE;
}

/**
 * @returns {Promise<{ [key: string]: string }>}
 */
const Dictionary = () => {
	const localeFromToken = GetBrowserLocale();
	const fileWithI18N = (
		LOCALES_LIST.includes(localeFromToken) ? localeFromToken :
		LOCALES_LIST.includes(`${localeFromToken}.json`) ? `${localeFromToken}.json` :
		LOCALES_LIST.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE :
		`${DEFAULT_LOCALE}.json`
	);

	return import(`./${fileWithI18N}`)
	.then((rawImportedModule) => Promise.resolve(rawImportedModule.default || rawImportedModule));
}

export default Dictionary;

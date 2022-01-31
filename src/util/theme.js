import store from "../store";


/** @typedef {"light" | "dark" | "schedule" | "system"} ThemeEnum */
/**
 * @typedef ThemeObject
 * @property {ThemeEnum} raw
 * @property {boolean} isDark
 * @property {string} icon
 * @property {string} name
 */

const StoreLocalGetRawTheme = () => localStorage.getItem("theme-raw");

/**
 * @param {ThemeEnum} [themeRawParam]
 */
const CheckDarkTheme = (themeRawParam = "") => {
	/** @type {ThemeEnum} */
	const themeRaw = themeRawParam || StoreLocalGetRawTheme();
	if (themeRaw === "dark") return true;

	if (themeRaw === "schedule") return (
		new Date().getHours() > 19 || (new Date().getHours() === 19 && new Date().getMinutes() >= 30) ||
		new Date().getHours() < 7 || (new Date().getHours() === 7 && new Date().getMinutes() <= 29)
	);

	if (themeRaw === "light") return false;

	return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
};

window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener("change", (mediaQueryListEvent) => {
	if (["light", "dark", "schedule"].includes(store.getters.theme.raw)) return;

	store.commit("theme", "system");
});

/**
 * @param {ThemeEnum} themeRawParam
 * @returns {string}
 */
const GetThemeIcon = (themeRawParam) => {
	return (
		themeRawParam === "light" ? "light_mode" :
		themeRawParam === "dark" ? "dark_mode" :
		themeRawParam === "schedule" ? "auto_awesome" :
		"settings_suggest"
	);
};

/**
 * @param {ThemeEnum} themeRawParam
 * @returns {string}
 */
const GetThemeName = (themeRawParam) => `theme_desc_${themeRawParam}`;


/**
 * @param {ThemeEnum} [themeRawParam]
 * @returns {ThemeObject}
 */
export const GetCompleteTheme = (themeRawParam = "") => {
	const themeRaw = themeRawParam || StoreLocalGetRawTheme() || "system";

	return {
		raw: themeRaw,
		isDark: CheckDarkTheme(themeRaw),
		icon: GetThemeIcon(themeRaw),
		name: GetThemeName(themeRaw)
	}
};

export default {
	GetCompleteTheme
}

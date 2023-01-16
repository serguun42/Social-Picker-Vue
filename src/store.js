import Vue from "vue";
import Vuex from "vuex";
import DefaultLocale from "./config/i18n/en_US.json";
import { ANIMATIONS } from "./util/animations";
import { API_METHODS } from "./util/api";
import Dispatcher from "./util/dispatcher";
import { CompareLists, ExpandUserList, FetchRemoteList, GetLocalList } from "./util/gamephotography";
import LogMessageOrError from "./util/log";
import { GetCompleteTheme } from "./util/theme";


Vue.use(Vuex);

const store = new Vuex.Store({
	state: () => ({
		i18n: { ...DefaultLocale },

		/** @type {import("./util/theme").ThemeObject} */
		theme: GetCompleteTheme(),

		message: {
			text: "",
			shown: false,
		},
		lastMessageID: "",

		swaggerAPIShown: false,

		accountPermission: false,
		permissionToPaste: localStorage.getItem("permissionToPaste") === "allowed",

		/** @type {import("./types").SocialPost} */
		socialPost: null,

		socialPostPickedInSession: false,

		gamephotographyList: GetLocalList(),
	}),
	mutations: {
		/**
		 * @param {{text?: string, shown?: boolean}} payload
		 */
		setMessage(state, payload) {
			state.message = { ...payload };
		},
		/**
		 * @param {string} messageID
		 */
		lastMessageID(state, messageID) {
			state.lastMessageID = messageID;
		},

		/**
		 * @param {ThemeEnum} newTheme
		 */
		theme(state, newTheme) {
			if (!["light", "dark", "schedule", "system"].includes(newTheme))
				newTheme = "system";

			localStorage.setItem("theme-raw", newTheme);
			state.theme = GetCompleteTheme(newTheme);
			Dispatcher.call("themeChanged");
		},

		swaggerAPIShown(state) {
			state.swaggerAPIShown = true;

			window.scrollTo({ top: 0, behavior: "auto" });
		},

		/**
		 * @param {boolean} accountPermission
		 */
		accountPermission(state, accountPermission) {
			Dispatcher.call("accountPermission", accountPermission);
			state.accountPermission = accountPermission;
		},

		permissionToPaste(state) {
			localStorage.setItem("permissionToPaste", "allowed");
			state.permissionToPaste = true;
		},

		/**
		 * @param {import("./types").SocialPost} socialPost
		 */
		socialPost(state, socialPost) {
			if (socialPost === null)
				return state.socialPost = socialPost;

			if (!socialPost?.medias?.length || !socialPost?.postURL)
				return LogMessageOrError(new Error(`Malformed <socialPost>`));

			state.socialPost = socialPost;
		},

		socialPostPickedInSession(state) {
			state.socialPostPickedInSession = true;
		},

		/**
		 * @param {import("./util/gamephotography").GamePhotographyList} newList
		 */
		replaceGamephotographyList(state, newList) {
			if (!Array.isArray(newList)) return;
			if (CompareLists(state.gamephotographyList, newList)) return;

			state.gamephotographyList = newList;
		},

		/**
		 * @param {string} newShot
		 */
		expandGamephotographyList(state, newShot) {
			state.gamephotographyList = ExpandUserList(newShot);
		}
	},
	actions: {
		/**
		 * @param {string} messageText
		 */
		showMessage({ commit, dispatch, getters }, messageText) {
			const currentMessageID = `${messageText}_${Date.now()}`;
			commit("lastMessageID", currentMessageID);
			commit("setMessage", { text: messageText, shown: true });
			dispatch("changeThemeColor", "#FFFFFF");

			setTimeout(() => {
				if (getters.lastMessageID !== currentMessageID) return;

				dispatch("hideMessage");
			}, ANIMATIONS.MESSAGE_SHOWN_TIME_MS);
		},
		hideMessage({ commit, dispatch }) {
			const currentMessageID = `hiding_message_${Date.now()}`;
			commit("lastMessageID", currentMessageID);
			commit("setMessage", { shown: false });

			dispatch("changeThemeColor");
		},

		changeTheme({ state, commit, dispatch }) {
			const { raw } = state.theme;
			const themesToChoose = ["dark", "light", "schedule", "system", "dark"];
			const indexOfCurrentTheme = themesToChoose.indexOf(raw);

			commit("theme", themesToChoose[indexOfCurrentTheme + 1]);
			setTimeout(() => dispatch("changeThemeColor"), 300);
		},

		/**
		 * @param {string} newColor
		 */
		changeThemeColor(_context, newColor = "") {
			const settingThemeColor = (newColor || getComputedStyle(document.body).getPropertyValue("--header"))?.trim();
			const themeColorMetaTags = Array.from(document.head.querySelectorAll(`[data-meta-name="theme-color"]`));
			themeColorMetaTags.forEach((metaTag) => metaTag.setAttribute("content", settingThemeColor));
		},

		/**
		 * Pick post with API
		 * @param {string} postURL
		 */
		pickPost(context, postURL) {
			Dispatcher.call("loadingStarted");

			API_METHODS.MediaPick(postURL)
			.then((socialPost) => {
				if (socialPost?.error)
					return Promise.reject(socialPost);

				context.commit("socialPost", socialPost);
				context.commit("socialPostPickedInSession");
				Dispatcher.call("postPicked");
			})
			.catch(/** @param {import("@/types").DefaultError} e */ (e) => {
				LogMessageOrError(e);

				context.dispatch("showMessage", context.getters.i18n(e?.reason || "error"));
			})
			.finally(() => Dispatcher.call("loadingEnded"));
		},

		fetchGamephotographyList(context) {
			FetchRemoteList()
			.then((freshList) => context.commit("replaceGamephotographyList", freshList))
			.catch(LogMessageOrError);
		}
	},
	getters: {
		i18n: (state) => ((key) => state.i18n[key?.toLowerCase().replace(/_/g, " ")] || key),
		theme: (state) => state.theme,
		message: (state) => state.message,
		lastMessageID: (state) => state.lastMessageID,
		swaggerAPIShown: (state) => state.swaggerAPIShown,
		accountPermission: (state) => state.accountPermission,
		permissionToPaste: (state) => state.permissionToPaste,
		socialPost: (state) => state.socialPost,
		socialPostOK: (state) => !!state.socialPost?.medias?.length && !!state.socialPost?.postURL,
		socialPostPickedInSession: (state) => state.socialPostPickedInSession,
		gamephotographyList: (state) => state.gamephotographyList
	}
});

export default store;

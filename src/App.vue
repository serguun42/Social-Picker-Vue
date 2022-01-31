<template>
	<div>
		<loader id="loader" v-show="loading"></loader>

		<message></message>

		<div id="main" v-if="!$store.getters.swaggerAPIShown">
			<first-prompt
				v-if="firstPromptActive"
				ref="first-prompt"
			></first-prompt>
			<second-prompt
				v-if="secondPromptActive"
				ref="second-prompt"
				:isFullyOpened="secondPromptFullyOpened"
			></second-prompt>
		</div>
		<swagger v-else></swagger>

		<auto-opener></auto-opener>

		<site-footer></site-footer>
	</div>
</template>

<script>
import Loader from "./components/Loader.vue";
import Message from "./components/Message.vue";
import FirstPrompt from "./views/FirstPrompt.vue";
import SecondPrompt from "./views/SecondPrompt.vue";
import Swagger from "./components/Swagger.vue";
import AutoOpener from "./components/AutoOpener.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { ANIMATIONS, FadeIn, FadeOut } from "./util/animations";
import { API_METHODS } from "./util/api";
import Dispatcher from "./util/dispatcher";
import LogMessageOrError from "./util/log";

export default {
	name: "App",
	components: { SiteFooter, Swagger, FirstPrompt, SecondPrompt, Loader, Message, AutoOpener },
	data() {
		return {
			loading: false,
			firstPromptActive: true,
			secondPromptActive: false,
			secondPromptFullyOpened: false
		};
	},
	methods: {
		setThemeClass() {
			if (this.$store.getters.theme.isDark)
				document.body.classList.add("is-dark");
			else
				document.body.classList.remove("is-dark");

			this.$store.dispatch("changeThemeColor");
		},
		postPicked() {
			if (!this.$store.getters.socialPostOK)
				return this.$store.dispatch("showMessage", this.$store.getters.i18n("malformed post"));

			window.scrollTo({ top: 0, behavior: "auto" });

			this.secondPromptActive = true;

			this.$nextTick(() => {
				const firstPromptElem = document.getElementById("first-prompt");
				const secondPromptElem = document.getElementById("second-prompt");

				FadeOut(firstPromptElem, ANIMATIONS.VIEW_SWITCHING_MS)
				.then(() => this.firstPromptActive = false);

				FadeIn(secondPromptElem, ANIMATIONS.VIEW_SWITCHING_MS)
				.then(() => this.secondPromptFullyOpened = true);
			});
		},
		restart() {
			window.scrollTo({ top: 0, behavior: "auto" });

			this.secondPromptFullyOpened = false;
			this.firstPromptActive = true;

			this.$nextTick(() => {
				const firstPromptElem = document.getElementById("first-prompt");
				const secondPromptElem = document.getElementById("second-prompt");

				FadeIn(firstPromptElem, ANIMATIONS.VIEW_SWITCHING_MS);

				FadeOut(secondPromptElem, ANIMATIONS.VIEW_SWITCHING_MS)
				.then(() => {
					this.secondPromptActive = false;
					this.$store.commit("socialPost", null);
				});
			});
		}
	},
	created() {
		this.setThemeClass();
		Dispatcher.link("themeChanged", this.setThemeClass);
		Dispatcher.link("loadingStarted", () => this.loading = true);
		Dispatcher.link("loadingEnded", () => this.loading = false);
		Dispatcher.link("postPicked", this.postPicked);
		Dispatcher.link("restart", this.restart);
	},
	mounted() {
		API_METHODS.AccountCheck()
		.then((check) => {
			this.$store.commit("accountPermission", !!check.success);

			if (!check.success) return Promise.reject(check);
		})
		.catch(/** @param {import("./types").DefaultError} e */ (e) => {
			LogMessageOrError(e);

			this.$store.dispatch("showMessage", this.$store.getters.i18n(e?.reason || "error"));
		});
	}
};
</script>

<style>
#main {
	display: block;
	position: relative;
	min-height: calc(100% - 42px);
	min-height: calc(100vh - 42px);
	padding: 32px 0;
	box-sizing: border-box;
}

#loader {
	z-index: 20;
}
</style> 
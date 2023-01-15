<template>
	<div id="first-prompt">
		<h1 class="title title--top default-title-font default-no-select">Social Picker</h1>
		<h2 class="title title--sub default-title-font default-no-select" v-text="$store.getters.i18n('title description')"></h2>

		<card>
			<input-area
				:label="$store.getters.i18n('link to post')"
				:inputValue="postURL"
				:type="'text'"
				:autocomplete="false"
				:autofocus="true"
				:error="$store.getters.i18n('bad url')"
				:patternHandler="isURLValid"
				:enterHandler="pickPost"
				ref="link-input"
			></input-area>

			<div class="buttons-container">
				<div
					class="buttons-container__button default-no-select default-pointer"
					v-wave
					v-text="$store.getters.i18n('paste')"
					@click="paste"
				></div>
				<div
					class="buttons-container__button default-no-select"
					:class="{
						'default-pointer': validURL,
						'buttons-container__button--inactive': !validURL,
						[`buttons-container__button--${platform.toLowerCase()}`]: validURL
					}"
					v-wave
					@click="pickPost"
				>
					<span v-text="$store.getters.i18n('pick')"></span> <span v-if="platform" v-text="platform"></span>
				</div>
			</div>
		</card>
	</div>
</template>

<script>
import Card from "@/components/Card.vue";
import InputArea from "@/components/inputs/InputArea.vue";
import LogMessageOrError from "@/util/log";
import Dispatcher from "@/util/dispatcher";
import { CheckForLink } from "@/util/check-for-link";

/** @type {import("vue").ComponentOptions<>} */
export default {
	name: "FirstPrompt",
	components: { Card, InputArea },
	data() {
		return {
			postURL: { raw: "" },
			validURL: false,
			platform: ""
		};
	},
	watch: {
		"postURL.raw": function(value) {
			this.platform = CheckForLink(value) || "";
			this.validURL = !!this.platform;
		}
	},
	methods: {
		/**
		 * @param {string} value
		 * @returns {boolean}
		 */
		isURLValid(value) {
			return !!CheckForLink(value);
		},
		pickPost() {
			this.platform = CheckForLink(this.postURL.raw) || "";
			this.validURL = !!this.platform;
			if (!this.validURL) return;

			this.$store.dispatch("pickPost", this.postURL.raw);
		},
		paste() {
			navigator.clipboard.readText()
			.then((readText) => {
				if (CheckForLink(readText))
					this.postURL.raw = new URL(readText).href;
				else
					this.$store.dispatch("showMessage", this.$store.getters.i18n("bad url"));

				this.$store.commit("permissionToPaste");

				this.pickPost();
			})
			.catch(LogMessageOrError);
		},
		onCtrlV() {
			/** @type {HTMLElement} */
			const fieldAreaElem = this.$refs["link-input"].$el || this.$refs["link-input"];
			const textfieldElem = fieldAreaElem?.querySelector(".s42-field-area__textfield--v2");

			if (!textfieldElem?.classList?.contains("s42-field-area__textfield--is-dirty"))
				this.paste();
		}
	},
	mounted() {
		Dispatcher.link("ctrl+v", this.onCtrlV);

		if (this.$store.getters.permissionToPaste) {
			if (IS_DEV) return;

			navigator.clipboard.readText()
			.then((readText) => {
				if (!CheckForLink(readText)) return;

				const LocalAutoOpenerDone = () => {
					Dispatcher.unlink("autoOpenerDone", LocalAutoOpenerDone);

					this.postURL.raw = readText;
					this.pickPost();
				};

				Dispatcher.call("autoOpenerStart");
				Dispatcher.link("autoOpenerDone", LocalAutoOpenerDone);
			})
			.catch(LogMessageOrError)
		}
	},
	beforeDestroy() {
		Dispatcher.unlink("ctrl+v", this.onCtrlV);
	}
};
</script>

<style>
.title {
	display: block;
	position: relative;

	max-width: 600px;
	padding: 0 32px;
	margin: 0 auto;
}

.title--top {
	font-size: 42px;
	margin-bottom: 16px;
}

.title--sub {
	font-size: 24px;
	margin-bottom: 32px;
}

@media (max-width: 600px) {
	.title--sub {
		font-size: 18px;
	}
}

.buttons-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	position: relative;

	margin-top: 16px;
}

.buttons-container__button {
	display: inline-block;
	position: relative;

	min-width: 64px;
	height: 36px;
	margin-right: 16px;
	padding: 0 16px;

	background-color: var(--buttons);
	color: #FFF;
	border-radius: 5px;
	overflow: hidden;

	box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
	will-change: box-shadow;
	transition: box-shadow 200ms cubic-bezier(0.4, 0, 1, 1);

	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	text-decoration: none;
	text-align: center;
	line-height: 36px;
	vertical-align: middle;
	letter-spacing: 0;
}

.buttons-container__button:active {
	box-shadow: 0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);
}

.buttons-container__button:last-of-type {
	margin: 0;
}

.buttons-container__button--inactive {
	background-color: #9b9b9b;
	color: #777;
}

.buttons-container__button--twitter {
	background-color: #00a2f5;
	color: #FFF;
}

.buttons-container__button--instagram {
	background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
	color: #070708;
}

.buttons-container__button--reddit {
	background-color: #ff4500;
	color: #FFF;
}

.buttons-container__button--youtube {
	background-color: #FF0000;
	color: #FFF;
}

.buttons-container__button--pixiv {
	background-color: #0097FA;
	color: #FFF;
}
</style>

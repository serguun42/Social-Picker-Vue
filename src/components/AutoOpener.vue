<template>
	<div class="auto-opener">
		<div class="auto-opener__obfuscator default-pointer" @click="stop"></div>
		<div class="auto-opener__bar default-no-select default-pointer" ref="bar" @click="stop">
			<div class="auto-opener__bar__title">
				<i class="material-icons material-icons-round">autorenew</i>
				<span v-text="openingIn"></span>
			</div>
			<button class="auto-opener__bar__close-btn default-pointer" v-wave @click="stop">
				<i class="material-icons material-icons-round">close</i>
				<span v-text="$store.getters.i18n('close')"></span>
			</button>
		</div>
	</div>
</template>

<script>
import Dispatcher from "@/util/dispatcher";
import { ANIMATIONS, FadeIn, FadeOut, GlobalAnimation } from "@/util/animations";

export default {
	name: "AutoOpener",
	data() {
		return {
			AUTO_OPENER_WAITING_SECONDS: ANIMATIONS.AUTO_OPENER_WAITING_S,
			secondsUpdated: 0,
			updatingInterval: -1,
			disabled: false,

			/** @type {HTMLElement} */
			containerElem: null,
			/** @type {HTMLElement} */
			barElem: null
		}
	},
	computed: {
		openingIn: {
			/** @returns {string} */
			get() {
				return (this.$store.getters.i18n("opening in") || "")
				.replace(/__TIME__/, this.AUTO_OPENER_WAITING_SECONDS - this.secondsUpdated);
			}
		}
	},
	methods: {
		updateTimer() {
			if (this.disabled)
				return this.stop();

			if (++this.secondsUpdated >= this.AUTO_OPENER_WAITING_SECONDS) {
				this.stop();

				/**
				 * Doubling just for the sake of safety.
				 * Anyway it's gonna be caught only one time through `"once"`
				 */
				Dispatcher.call("autoOpenerDone");
				setTimeout(() => Dispatcher.call("autoOpenerDone"), 1000);
			}
		},
		start() {
			Dispatcher.unlink("autoOpenerStart", this.start);

			FadeIn(this.containerElem, ANIMATIONS.AUTO_OPENER_SLIDING_MS);

			GlobalAnimation(ANIMATIONS.AUTO_OPENER_SLIDING_MS, (progress) => {
				this.barElem.style.bottom = 48 * (progress - 1) + "px";
			});

			this.disabled = false;
			this.updatingInterval = setInterval(this.updateTimer, 1000);
		},
		stop() {
			this.disabled = true;
			clearInterval(this.updateTimer);

			FadeOut(this.containerElem, ANIMATIONS.AUTO_OPENER_SLIDING_MS)
			.then(() => this.barElem.style.removeProperty("bottom"));
		}
	},
	mounted() {
		this.containerElem = this.$el;
		this.barElem = this.$refs["bar"];

		Dispatcher.link("autoOpenerStart", this.start);
	},
	beforeDestroy() {
		Dispatcher.unlink("autoOpenerStart", this.start);
	}
}
</script>

<style>
.auto-opener {
	display: none;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	z-index: 15;
}

.auto-opener__obfuscator {
	display: block;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	background-color: rgba(0, 0, 0, 0.5);
}

.auto-opener__bar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: fixed;

	width: 100%;
	height: 48px;

	left: 0;
	bottom: -48px;

	padding: 6px;

	color: var(--text);
	background-color: var(--background);
	border-radius: 10px 10px 0 0;
	box-shadow: 0 -1px 8px 2px rgba(50, 50, 50, 0.15);

	z-index: 15;
	overflow: hidden;
}

@media (min-width: 600px) {
	.auto-opener__bar {
		width: 600px;
		left: calc(50% - 300px);
	}
}

.auto-opener__bar__title {
	display: block;
	position: relative;

	font-weight: 500;
	font-size: 14px;
	line-height: 36px;
	height: 36px;

	max-width: calc(100% - 100px);
	padding: 0 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	text-transform: uppercase;
}

.auto-opener__bar__title .material-icons {
	font-size: 20px;
	margin-right: 4px;
	vertical-align: -5px;
}

.auto-opener__bar__close-btn {
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

	box-shadow: none;
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

.auto-opener__bar__close-btn .material-icons {
	font-size: 20px;
	margin-right: 4px;
	vertical-align: -5px;
}
</style>
<template>
	<div
		class="field-area"
		:class="{
			'field-area--no-padding': noPadding
		}"
	>
		<div
			class="field-area__textfield"
			:class="{
				'field-area__textfield--with-error-message': error,
				'field-area__textfield--is-always-dirty': this.type === 'date',
				'field-area__textfield--is-dirty': inputValue.raw,
				'field-area__textfield--is-focused': isFocused
			}"
		>
			<input
				class="field-area__textfield__input"
				:id="`field-area__textfield__input-${stamp}`"
				:type="type"
				:name="name"
				:autocomplete="autocomplete === true ? 'on' : autocomplete"
				ref="actual-input"
				v-model="inputValue.raw"
				@focus="isFocused = true"
				@blur="isFocused = false"
				@keyup="inputKeyup"
			/>
			<label
				class="field-area__textfield__label"
				:for="`field-area__textfield__input-${stamp}`"
				v-text="label"
			></label>
			<div class="field-area__textfield__input-border"></div>
			<div class="field-area__textfield__input-dashed-border"></div>
			<div class="field-area__textfield__error" v-if="errorShown" v-html="error"></div>
		</div>
		<div
			class="field-area__icon"
			@click="clearButtonHandler"
			v-show="!!inputValue.raw"
			v-wave
		>
			<span class="material-icons material-icons-round">clear</span>
		</div>
	</div>
</template>

<script>
import Dispatcher from "@/util/dispatcher";
export default {
	name: "InputArea",
	props: {
		inputValue: Object,
		label: String,
		type: {
			type: String,
			required: false,
			default: "text"
		},
		name: {
			type: String,
			required: false
		},
		autocomplete: {
			type: [String, Boolean],
			required: false
		},
		error: {
			type: String,
			required: false
		},
		patternHandler: {
			type: Function,
			required: false
		},
		enterHandler: {
			type: Function,
			required: false
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		noPadding: {
			type: Boolean,
			required: false
		}
	},
	watch: {
		/** @param {string} value */
		"inputValue.raw": function(value) {
			this.$emit("onInput");

			if (value?.length && this.error && typeof this.patternHandler == "function") {
				this.errorShown = !this.patternHandler(value);
			}
		}
	},
	data() {
		return {
			errorShown: false,
			isFocused: false,
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`
		}
	},
	methods: {
		clearButtonHandler() {
			this.inputValue.raw = "";
			this.$refs["actual-input"].value = "";
			this.$emit("clear");
		},
		inputKeyup(e) {
			if (e.code === "Enter" || e.key === "Enter")
				if (typeof this.enterHandler == "function")
					this.enterHandler(e);
		},
		onAnyKey() {
			if (this.autofocus)
				this.$refs["actual-input"].focus();
		}
	},
	created() {
		Dispatcher.link("anyKey", this.onAnyKey);
	},
	beforeDestroy() {
		Dispatcher.unlink("anyKey", this.onAnyKey);
	}
}
</script>

<style>
.field-area {
	--field-font-family: "Roboto", "Noto Sans", Arial, Helvetica, sans-serif;
	--field-text-color: var(--text);
	--field-accent-color: var(--primary);

	display: block;
	position: relative;

	width: 100%;
	height: 64px;

	margin: 0 auto;
	padding: 22px 16px 0;
	box-sizing: border-box;

	font-family: var(--field-font-family);

	background-color: transparent;
}

.field-area.field-area--no-padding {
	padding-left: 0;
	padding-right: 0;
}

.field-area__textfield {
	display: block;
	position: relative;

	width: calc(100% - 56px);
	height: 48px;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.field-area__textfield__input {
	display: block;
	position: relative;

	width: 100%;
	height: 20px;

	margin: 0;
	padding: 0;
	box-sizing: border-box;

	border: none;
	outline: none;

	font-family: var(--field-font-family);
	font-weight: 400;
	font-size: 16px;
	line-height: 20px;

	color: var(--field-text-color);
	background-color: transparent;
}

.field-area__textfield__input:focus,
.field-area__textfield__input:active {
	outline: none;
}

.field-area__textfield__label {
	display: block;
	position: absolute;

	width: 100%;
	height: 20px;

	left: 0;
	top: 0;

	margin: 0;
	padding: 0;
	box-sizing: border-box;

	font-family: var(--field-font-family);
	font-weight: 400;
	font-size: 16px;
	line-height: 20px;
	color: var(--field-accent-color);

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	user-select: none;

	border: none;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;

	transition: top 150ms ease-out 0s,
				font-size 150ms ease-out 0s;
}

.field-area__textfield.field-area__textfield--is-always-dirty .field-area__textfield__label,
.field-area__textfield.field-area__textfield--is-dirty .field-area__textfield__label,
.field-area__textfield.field-area__textfield--is-focused .field-area__textfield__label {
	top: -22px;
	font-size: 12px;

	cursor: default;
}

.field-area__textfield__input-border {
	display: block;
	position: relative;

	width: 0;
	height: 2px;

	margin: 4px auto 0;
	padding: 0;
	box-sizing: border-box;

	background-color: var(--field-accent-color);

	transition: width 150ms ease-out 0s;
}

.field-area__textfield__input-dashed-border {
	display: block;
	position: relative;

	width: 100%;
	height: 2px;

	margin: -2px 0;
	padding: 0;
	box-sizing: border-box;

	border-top: 2px dashed var(--field-accent-color);
	opacity: 0.5;

	transition: border-color 150ms ease-out 0s;
}

.field-area__textfield.field-area__textfield--is-focused .field-area__textfield__input-border {
	width: 100%;
}

.field-area__textfield.field-area__textfield--is-focused .field-area__textfield__input-dashed-border {
	border-color: transparent;
}

.field-area__textfield__error {
	display: block;
	position: relative;

	width: 100%;
	height: 16px;

	margin: 4px 0 0;
	padding: 0;
	box-sizing: border-box;

	font-family: var(--field-font-family);
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;

	color: #d50000;

	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	user-select: none;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.field-area__icon {
	display: block;
	position: absolute;

	width: 48px;
	height: 48px;

	right: 0;
	top: 8px;

	margin: 0;
	padding: 12px;
	box-sizing: border-box;

	border-radius: 24px;
	overflow: hidden;

	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	user-select: none;

	color: var(--field-accent-color);

	border: none;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.field-area__icon .mdl-ripple {
	background-color: var(--field-accent-color);
}
</style>
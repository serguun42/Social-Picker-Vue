<template>
	<label
		class="mdl-checkbox mdl-js-checkbox is-upgraded"
		:class="{ 'is-checked': checked }"
		:for="`input-checkbox-${stamp}`"
	>
		<input
			ref="checkbox"
			type="checkbox"
			class="mdl-checkbox__input"
			:id="`input-checkbox-${stamp}`"
			:checked="checked"
			@input="chosen"
		>
		<span
			class="mdl-checkbox__label"
			v-if="text"
			v-text="text"
		></span>
		<span class="mdl-checkbox__focus-helper"></span>
		<span class="mdl-checkbox__box-outline">
			<span class="mdl-checkbox__tick-outline"></span>
		</span>
		<span class="mdl-checkbox__ripple-container" v-wave></span>
	</label>
</template>

<script>
export default {
	name: "InputCheckbox",
	props: {
		checked: Boolean,
		text: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			/** @type {HTMLElement} */
			checkbox: null,
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`
		}
	},
	methods: {
		chosen() {
			this.$emit("chosen", !!this.checkbox.checked);
		}
	},
	mounted() {
		this.checkbox = this.$refs["checkbox"]
	}
}
</script>

<style>

</style>
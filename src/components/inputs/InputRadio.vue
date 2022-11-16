<template>
	<label
		class="mdl-radio mdl-js-radio is-upgraded"
		:class="{ 'is-checked': checked }"
		:for="`input-radio-${stamp}`"
		@click="chosen"
	>
		<input
			type="radio"
			class="mdl-radio__button category__value__input"
			:name="group"
			:id="`input-radio-${stamp}`"
			@input="chosen"
		>
		<span
			class="mdl-radio__label"
			v-if="text"
			v-text="text"
		></span>
		<span class="mdl-radio__outer-circle"></span>
		<span class="mdl-radio__inner-circle"></span>
		<span class="mdl-radio__ripple-container" v-wave></span>
	</label>
</template>

<script>
export default {
	name: "InputRadio",
	props: {
		group: String,
		checked: Boolean,
		text: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`
		}
	},
	methods: {
		chosen() {
			this.$emit("chosen");
		}
	}
}
</script>

<style>

</style>
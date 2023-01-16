<template>
	<div class="category--text">
		<div class="category__name" v-if="name" v-text="name"></div>

		<div
			class="category__value"
			:class="{ 'category__value--with-input': value.kind === 'input' }"
			v-for="(value, valueIndex) in values"
			:key="`category-${stamp}__value-${valueIndex}`"
		>
			<input-radio
				v-if="value.kind === 'predefined-line' || value.kind === 'input'"
				:class="{ 'input-radio--with-input': value.kind === 'input' }"

				:group="`category-${stamp}`"
				:checked="indexOfChecked === valueIndex"
				:text="value.kind === 'predefined-line' ? value.raw : ''"
				v-on:chosen="radioInput(valueIndex)"
			></input-radio>

			<input-area
				v-if="value.kind === 'input'"

				:inputValue="value"
				:label="value.inputLabel"
				:type="value.inputType || 'text'"
				:noPadding="true"
				@onInput="customOnInput"
			></input-area>
		</div>
	</div>
</template>


<script>
import InputArea from "../InputArea.vue";
import InputRadio from "../InputRadio.vue";

export default {
	name: "CategoryText",
	components: { InputArea, InputRadio },
	props: {
		name: {
			type: String,
			required: false
		},
		result: Object,
		predefinedValues: {
			default: () => [],
			type: Array,
			required: false
		},
		customValueLabel: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`,
			indexOfChecked: 0,
			/** @type {({ kind: "predefined-line", raw: string } | { kind: "input", raw: string, inputType: string, inputLabel: string })[]} */
			values: [
				...this.predefinedValues.map((current) =>
					typeof current === "string" || typeof current === "number"
					? { kind: "predefined-line", raw: current.toString() }
					: current
				),
				this.customValueLabel
				? {
					kind: "input",
					inputType: "text",
					inputLabel: this.customValueLabel,
					raw: ""
				}
				: null
			].filter(Boolean)
		}
	},
	methods: {
		calcResult() {
			this.result.raw = this.values[this.indexOfChecked].raw;
		},
		radioInput(newIndexOfChecked) {
			this.indexOfChecked = newIndexOfChecked;
			this.calcResult();
		},
		customOnInput() {
			const indexOfField = this.values.findIndex(({ kind }) => kind === "input");

			if (!this.values[indexOfField]) return;

			if (this.values[indexOfField].raw)
				this.radioInput(indexOfField);
			else if (!this.values[indexOfField].raw && indexOfField === this.indexOfChecked)
				this.radioInput(0);
		}
	},
	mounted() {
		this.calcResult();
	}
}
</script>

<style>
.category__value.category__value--with-input {
	padding-top: 0;
	padding-bottom: 0;
}

.input-radio--with-input {
	margin-top: 16px;
}
</style>
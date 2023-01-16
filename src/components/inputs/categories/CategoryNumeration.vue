<template>
	<div class="category--numeration">
		<div class="category__name" v-if="name" v-text="name"></div>

		<div class="category__value">
			<input-checkbox
				:checked="isNumerationEnabled"
				:text="$store.getters.i18n('numeration enabled')"
				@chosen="numerationEnabling"
			/>
		</div>

		<div class="category__sub-category">
			<category-text :result="resultForCategoryText" :predefinedValues="predefinedValuesForCategoryText" />

			<div class="category__value">
				<input-checkbox
					:checked="isAddingShotPrefix"
					:text="$store.getters.i18n('add shot to filename')"
					@chosen="addingShowPrefixEnabling"
				/>
			</div>

			<div
				class="category__sub-category__obfuscator default-pointer default-no-select"
				@click="numerationEnabling(true)"
				ref="obfuscator"
			/>
		</div>
	</div>
</template>

<script>
import { ANIMATIONS, FadeIn, FadeOut } from "@/util/animations";
import InputCheckbox from "../InputCheckbox.vue";
import CategoryText from "./CategoryText.vue";

export default {
	name: "CategoryNumeration",
	components: { InputCheckbox, CategoryText },
	props: {
		name: {
			type: String,
			required: false
		},
		result: Object
	},
	watch: {
		"resultForCategoryText.raw": function() {
			this.calcResult();
		},
		"result.enabled": function() {
			this.numerationEnabling(this.result.enabled, true);
		},
		"result.startingWith": function() {
			this.updateStartingWith();
		}
	},
	data() {
		return {
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`,

			isNumerationEnabled: this.result.enabled,
			indexOfChecked: 0,
			isAddingShotPrefix: this.result.addingShotPrefix,

			resultForCategoryText: { raw: `${this.result.startingWith || 1}` },

			predefinedValuesForCategoryText: [
				{
					kind: "input",
					inputType: "number",
					inputLabel: this.$store.getters.i18n("numeration custom"),
					raw: `${this.result.startingWith || 1}`
				}
			]
		};
	},
	methods: {
		updateStartingWith() {
			if (!this.result.startingWith) return;

			this.resultForCategoryText.raw = `${this.result.startingWith || 1}`;
			this.predefinedValuesForCategoryText[0].raw = `${this.result.startingWith || 1}`;
		},
		calcResult() {
			this.result.enabled = this.isNumerationEnabled;
			this.result.startingWith = parseInt(this.resultForCategoryText.raw);
			this.result.addingShotPrefix = this.isAddingShotPrefix;
		},
		numerationEnabling(newNumerationEnabled, silent = false) {
			this.isNumerationEnabled = !!newNumerationEnabled;

			if (newNumerationEnabled) FadeOut(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);
			else FadeIn(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);

			if (!silent) this.calcResult();
		},
		addingShowPrefixEnabling(newAddingShotPrefix) {
			this.isAddingShotPrefix = newAddingShotPrefix;

			this.calcResult();
		}
	},
	mounted() {
		this.calcResult();
	}
};
</script>

<style></style>

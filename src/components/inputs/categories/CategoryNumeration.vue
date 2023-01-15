<template>
	<div class="category--numeration">
		<div class="category__name" v-if="name" v-text="name"></div>

		<div class="category__value">
			<input-checkbox
				:checked="isNumerationEnabled"
				:text="$store.getters.i18n('numeration enabled')"
				@chosen="numerationEnabling"
			></input-checkbox>
		</div>

		<div class="category__sub-category">
			<category-text :result="resultForCategoryText" :predefinedValues="valuesForCategoryText"></category-text>

			<div class="category__value">
				<input-checkbox
					:checked="isAddingShotPrefix"
					:text="$store.getters.i18n('add shot to filename')"
					@chosen="addingShowPrefixEnabling"
				></input-checkbox>
			</div>

			<div
				class="category__sub-category__obfuscator default-pointer default-no-select"
				@click="numerationEnabling(true)"
				ref="obfuscator"
			></div>
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
		"resultForCategoryText.raw": function () {
			this.calcResult();
		}
	},
	data() {
		return {
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`,

			isNumerationEnabled: this.result.enabled,
			indexOfChecked: 0,
			isAddingShotPrefix: this.result.addingShotPrefix,

			resultForCategoryText: { raw: "" },

			valuesForCategoryText: [
				{
					kind: "input",
					inputType: "number",
					inputLabel: this.$store.getters.i18n("numeration custom"),
					raw: "1"
				}
			]
		};
	},
	methods: {
		calcResult() {
			this.result.enabled = this.isNumerationEnabled;
			this.result.startingWith = parseInt(this.resultForCategoryText.raw);
			this.result.addingShotPrefix = this.isAddingShotPrefix;
		},
		numerationEnabling(newNumerationEnabled) {
			this.isNumerationEnabled = !!newNumerationEnabled;

			if (this.isNumerationEnabled) FadeOut(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);
			else FadeIn(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);

			this.calcResult();
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

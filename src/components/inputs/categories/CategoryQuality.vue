<template>
	<div class="category--quality">
		<div class="category__name" v-if="name" v-text="name"></div>

		<div class="category__value">
			<input-checkbox
				:checked="isQualityEnabled"
				:text="$store.getters.i18n('additional quality label enabled')"
				@chosen="qualityEnabling"
			></input-checkbox>
		</div>

		<div class="category__sub-category">
			<category-text :result="resultForCategoryText" :predefinedValues="valuesForCategoryText"></category-text>

			<div
				class="category__sub-category__obfuscator default-pointer default-no-select"
				@click="qualityEnabling(true)"
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
	name: "CategoryQuality",
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

			isQualityEnabled: this.result.enabled,
			indexOfChecked: 0,

			resultForCategoryText: { raw: "" },

			valuesForCategoryText: [
				"4K",
				"QHD",
				{
					kind: "input",
					inputType: "text",
					inputLabel: this.$store.getters.i18n("custom quality"),
					raw: ""
				}
			]
		};
	},
	methods: {
		calcResult() {
			this.result.enabled = this.isQualityEnabled;
			this.result.label = this.resultForCategoryText.raw;
		},
		qualityEnabling(newQualityEnabled) {
			this.isQualityEnabled = !!newQualityEnabled;

			if (this.isQualityEnabled) FadeOut(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);
			else FadeIn(this.$refs["obfuscator"], ANIMATIONS.CATEGORY_OBFUSCATOR_FADING_MS);

			this.calcResult();
		}
	},
	mounted() {
		this.calcResult();
		if (this.result.enabled) this.qualityEnabling(this.result.enabled);
	}
};
</script>

<style></style>

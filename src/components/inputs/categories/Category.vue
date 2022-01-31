<template>
	<component
		class="category"
		:is="dynamicCategory"

		:name="name"
		:predefinedValues="predefinedValues"
		:customValueLabel="customValueLabel"
		:result="result"
	></component>
</template>

<script>
import CategoryText from "./CategoryText.vue"
import CategoryNumeration from "./CategoryNumeration.vue";
import CategoryQuality from "./CategoryQuality.vue";
import CategoryYoutube from "./CategoryYoutube.vue";

export default {
	name: "Category",
	props: {
		type: String,
		name: {
			type: String,
			required: false
		},
		predefinedValues: {
			type: Array,
			required: false
		},
		result: Object,
		customValueLabel: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			dynamicCategory: (this.type === "text" ? CategoryText :
							  this.type === "numeration" ? CategoryNumeration :
							  this.type === "quality" ? CategoryQuality :
							  this.type === "youtube" ? CategoryYoutube :
							  "div")
		}
	}
}
</script>

<style>
.category {
	display: block;
	position: relative;

	width: 100%;
	max-width: 500px;

	margin: 0 auto;
	padding: 16px 0;
}

.category__sub-category {
	display: block;
	position: relative;

	width: 100%;

	padding: 0 16px;
}

.category__sub-category__obfuscator {
	display: block;
	position: absolute;

	width: 100%;
	height: 100%;

	top: 0;
	left: 0;

	background-color: var(--card-background-faded-50);

	z-index: 2;
}

.category__sub-category .category {
	padding-top: 0;
	padding-bottom: 0;
}

.category__name {
	display: block;
	position: relative;

	font-weight: 500;
	font-size: 16px;

	padding: 8px 46px;
}

.category__value {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: nowrap;
	flex-shrink: 0;
	position: relative;

	margin: 0;
	padding: 8px 20px;
}

.category__value .field-area {
	height: 56px;
	padding-top: 16px;
}
</style>
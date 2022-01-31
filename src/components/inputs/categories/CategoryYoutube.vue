<template>
	<div class="category--text">
		<div class="category__name" v-if="name" v-text="name"></div>

		<div
			class="category__value"
			v-for="(value, valueIndex) in values"
			:key="`category-${stamp}__value-${valueIndex}`"
		>
			<input-radio
				:group="`category-${stamp}`"
				:checked="indexOfChecked === valueIndex"
				:text="value.description || `${value.type} ${humanReadableSize(value.filesize)}`"
				v-on:chosen="youtubeQualityChosen(valueIndex)"
			></input-radio>
		</div>
	</div>
</template>


<script>
import InputRadio from "../InputRadio.vue";

/**
 * @param {string} desc
 * @returns {boolean}
 */
const LocalSpecialTest = (desc) => /video\s\+\saudio/i.test(desc);

export default {
	name: "CategoryYoutube",
	components: { InputRadio },
	props: {
		name: {
			type: String,
			required: false
		},
		result: Object,
		predefinedValues: {
			type: Array,
			required: false
		}
	},
	data() {
		return {
			stamp: `${~~(Math.random() * 1e8)}${Date.now()}`,
			indexOfChecked: 0,

			values: this.predefinedValues
					.sort((prev, next) => {
						if (LocalSpecialTest(next.description) && !LocalSpecialTest(prev.description))
							return 1;

						if (!LocalSpecialTest(next.description) && LocalSpecialTest(prev.description))
							return -1;

						return next.filesize - prev.filesize;
					})
		}
	},
	methods: {
		calcResult() {
			this.result.externalUrl = this.values[this.indexOfChecked].externalUrl;
			this.result.filetype = this.values[this.indexOfChecked].filetype;
		},
		youtubeQualityChosen(newIndexOfChecked) {
			this.indexOfChecked = newIndexOfChecked;
			this.calcResult();
		},
		humanReadableSize(bytes) {
			const power = Math.floor(Math.log(bytes) / Math.log(1024));
			return `${(bytes / Math.pow(1024, power)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][power]}`;
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
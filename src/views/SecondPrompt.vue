<template>
	<div id="second-prompt" :class="{ 'second-prompt--is-fully-opened': isFullyOpened }">
		<card :noPadding="true">
			<div
				class="save-button default-no-select default-pointer"
				v-wave
				@click="save"
			>
				<span v-text="$store.getters.i18n('save')"></span>
				<i class="material-icons material-icons-round">download</i>
			</div>


			<category
				v-if="youtube"
				:type="'youtube'"
				:predefinedValues="socialPost.medias"
				:name="$store.getters.i18n('video quality')"
				:result="results.youtube"
			></category>

			<category
				:type="'text'"
				:name="$store.getters.i18n('post author')"
				:predefinedValues="filteredAuthors"
				:customValueLabel="$store.getters.i18n('post author custom')"
				:result="results.author"
			></category>
			<category
				:type="'text'"
				:name="$store.getters.i18n('post caption')"
				:predefinedValues="filteredCaptions"
				:customValueLabel="$store.getters.i18n('post caption custom')"
				:result="results.caption"
			></category>

			<category
				v-if="!youtube"
				:type="'numeration'"
				:name="$store.getters.i18n('additional numeration')"
				:result="results.numeraition"
			></category>
			<category
				v-if="!youtube"
				:type="'quality'"
				:name="$store.getters.i18n('additional quality label')"
				:result="results.quality"
			></category>


			<div
				class="save-button default-no-select default-pointer"
				v-wave
				@click="save"
			>
				<span v-text="$store.getters.i18n('save')"></span>
				<i class="material-icons material-icons-round">download</i>
			</div>
		</card>

		<card :noPadding="true">
			<div
				class="save-button default-no-select default-pointer"
				v-wave
				@click="restart"
			>
				<span v-text="$store.getters.i18n('done then restart')"></span>
				<i class="material-icons material-icons-round">refresh</i>
			</div>
		</card>
	</div>
</template>

<script>
import Card from "@/components/Card.vue"
import Category from "@/components/inputs/categories/Category.vue";
import { CheckForDisplayName, CheckForLink, SafeParseURL } from "@/util/check-for-link";
import { API_METHODS } from "@/util/api";
import Dispatcher from "@/util/dispatcher";
import SaveFile from "@/util/save-file";

export default {
	components: { Card, Category },
	name: "SecondPrompt",
	props: {
		isFullyOpened: Boolean
	},
	data() {
		return {
			/** @type {string} */
			captionWithoutHashtags: this.$store.getters.socialPost.caption.replace(/#([\d\p{L}])+/gu, "").trim(),
			results: {
				author: { raw: "" },
				caption: { raw: "" },
				numeraition: { enabled: false, startingWith: 1, addingShotPrefix: false },
				quality: { enabled: false, label: "" },
				/** @type {import("@/types").Media} */
				youtube: { externalUrl: "", filetype: "" }
			}
		}
	},
	computed: {
		socialPost: {
			/** @returns {import("@/types").SocialPost} */
			get() { return this.$store.getters.socialPost; }
		},
		filteredAuthors: {
			/** @returns {string[]} */
			get() {
				const author = this.socialPost.author || "";
				const authorDisplayName = CheckForDisplayName(this.socialPost.authorURL);
				const authorNoHashtags = author.replace(/#([\d\p{L}])+/gu, "").trim();
				const authorOnlyUnicodeLetters = authorNoHashtags.replace(/[^\p{L}\p{M}\p{P}\d\-_.,!\s]/gu, "").trim();
				const authorMinimal = authorOnlyUnicodeLetters.replace(/[^\w\s.,]/g, "").replace(/\s+/g, " ").trim();

				return [
					author,
					authorDisplayName,
					authorNoHashtags,
					authorOnlyUnicodeLetters,
					authorMinimal
				].filter((value, index, array) => !!value && index === array.indexOf(value));
			}
		},
		filteredCaptions: {
			/** @returns {string[]} */
			get() {
				const caption = this.socialPost.caption || "";
				const captionNoHashtags = caption.replace(/#([\d\p{L}])+/gu, "").trim();
				const captionNoEntities = captionNoHashtags.replace(/@([\d\p{L}])+/gu, "").trim();
				const captionOnlyUnicodeLetters = captionNoEntities.replace(/[^\p{L}\p{M}\p{P}\d\-_.,!\s]/gu, "").trim();
				const captionFirstSentence = captionOnlyUnicodeLetters.split(/[,.;!?\/\\\(\)…]/)[0].trim();
				const captionMinimal = captionFirstSentence.replace(/[^\w\s.,]/g, "").replace(/\s+/g, " ").trim();

				return [
					caption,
					captionNoHashtags,
					captionNoEntities,
					captionOnlyUnicodeLetters,
					captionFirstSentence,
					captionMinimal
				].filter((value, index, array) => !!value && index === array.indexOf(value));
			}
		},
		youtube: {
			/** @returns {boolean} */
			get() { return CheckForLink(this.socialPost.postURL) === "Youtube"; }
		}
	},
	methods: {
		save() {
			const platformName = CheckForLink(this.socialPost.postURL);

			(this.youtube ? [this.results.youtube] : this.socialPost.medias).forEach((media, index) => {
				let filename = `${platformName} - ${this.results.author.raw?.trim()} - ${this.results.caption.raw?.trim()}`;

				if (this.results.numeraition.enabled)
					filename += (this.results.numeraition.addingShotPrefix ? " - Shot" : "");

				if (this.results.numeraition.enabled || this.socialPost.medias.length > 1)
					filename += " " + (
						index + (this.results.numeraition.enabled ? parseInt(this.results.numeraition.startingWith) || 1 : 1)
					);

				if (this.results.quality.enabled && this.results.quality.label)
					filename += ` - ${this.results.quality.label?.trim()}`;

				const source = (media.filehash ?
									API_METHODS.MediaDownloadURLByFilehash(media.filehash)
								:
									(media.original || media.externalUrl)
								);

				const extension = (
					media.filetype ||
					SafeParseURL(media.original || media.externalUrl).pathname
						.match(/\.([\w\:]+$)/)?.[1]?.replace(/\:\w+$/, "") ||
					(platformName === "Youtube" ? "mp4" : "jpg")
				);

				if (this.youtube)
					return window.open(source, "_blank");
				else
					SaveFile(source, filename, extension);
			});
		},
		/** @param {KeyboardEvent} e */
		onCtrlS(e) {
			if (
				e.ctrlKey &&
				(e.code === "KeyS" || e.key === "s" || e.key === "S" || e.key === "ы" || e.key === "Ы")
			) {
				e.preventDefault();
				this.save();
				return false;
			}
		},
		restart() {
			Dispatcher.call("restart");
		}
	},
	created() {
		window.addEventListener("keydown", this.onCtrlS);
	},
	beforeDestroy() {
		window.removeEventListener("keydown", this.onCtrlS);
	}
}
</script>

<style>
#second-prompt {
	display: none;
	position: absolute;
	top: 32px;
	left: 0;
	opacity: 0;

	width: 100%;
}

#second-prompt.second-prompt--is-fully-opened {
	display: block;
	position: relative;

	top: unset;
	left: unset;

	opacity: 1;
}

.save-button {
	display: block;
	position: relative;

	width: 100%;

	margin: 0;
	padding: 12px;

	font-weight: 700;
	font-size: 16px;
	line-height: 1em;
	text-transform: uppercase;
	text-align: center;

	color: #FFF;
	background-color: var(--buttons);
}

.save-button .material-icons {
	margin-left: 4px;
	vertical-align: -7px;
}
</style>
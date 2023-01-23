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
				v-if="isYoutube"
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
				v-if="!isYoutube"
				:type="'numeration'"
				:name="$store.getters.i18n('additional numeration')"
				:result="results.numeration"
			></category>
			<category
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
import Is4K from "@/util/is-4k";
import LogMessageOrError from "@/util/log";

export default {
	components: { Card, Category },
	name: "SecondPrompt",
	props: {
		isFullyOpened: Boolean
	},
	data() {
		/** @returns {import("../types").SocialPost} */
		const socialPost = this.$store.getters.socialPost;
		const is4K = Is4K(socialPost);

		return {
			/** @type {string} */
			captionWithoutHashtags: socialPost.caption.replace(/#(?<entity>[\d\p{L}]+)/gu, "").trim(),
			results: {
				author: { raw: "" },
				caption: { raw: "" },
				numeration: { enabled: false, startingWith: 1, addingShotPrefix: true },
				quality: { enabled: is4K, label: is4K ? "4K" : "" },
				/** @type {import("../types").Media} */
				youtube: { externalUrl: "", filetype: "" }
			}
		}
	},
	computed: {
		socialPost: {
			/** @returns {import("../types").SocialPost} */
			get() { return this.$store.getters.socialPost; }
		},
		filteredAuthors: {
			/** @returns {string[]} */
			get() {
				const author = this.socialPost.author || "";
				const authorDisplayName = CheckForDisplayName(this.socialPost.authorURL);
				const authorNoHashtags = author.replace(/#(?<entity>[\d\p{L}]+)/gu, "").replace(/\s+/g, " ").trim();
				const authorOnlyUnicodeLetters = authorNoHashtags.replace(/[^\p{L}\p{M}\p{P}\d\-_.,!\s]/gu, "").replace(/\s+/g, " ").trim();
				const authorMinimal = authorOnlyUnicodeLetters.replace(/[^\w\s.,]/g, "").replace(/\s+/g, " ").trim();

				return [
					authorDisplayName,
					author,
					authorNoHashtags,
					authorOnlyUnicodeLetters,
					authorMinimal
				]
				.filter((value, index, array) => !!value && index === array.indexOf(value))
				.filter(Boolean);
			}
		},
		filteredCaptions: {
			/** @returns {string[]} */
			get() {
				/** @type {string[]} */
				const parsedHashtags = [];

				const caption = this.socialPost.caption || "";
				const captionParsedHashtags = caption.replace(/#(?<entity>[\d\p{L}]+)/gu, (_match, entityGroup) => {
					if (!entityGroup || typeof entityGroup !== "string") return "";

					const parsedHashtag = entityGroup
						.replace(/(\p{Uppercase})(\p{Lowercase})/gu, " $1$2")
						.replace(/\s+/g, " ")
						.trim();

					parsedHashtags.push(parsedHashtag);
					return ` ${parsedHashtag}`;
				}).replace(/\s+/g, " ").trim();
				const captionNoHashtags = caption.replace(/#(?<entity>[\d\p{L}]+)/gu, "").replace(/\s+/g, " ").trim();
				const captionNoEntities = captionNoHashtags.replace(/@(?<entity>[\d\p{L}]+)/gu, "").replace(/\s+/g, " ").trim();
				const captionOnlyUnicodeLetters = captionNoEntities.replace(/[^\p{L}\p{M}\p{P}\d\-_.,!\s]/gu, "").replace(/\s+/g, " ").trim();
				const captionFirstSentence = captionOnlyUnicodeLetters.split(/[,.;!?/\\\()…\-]/)[0].replace(/\s+/g, " ").trim();
				const captionMinimal = captionFirstSentence.replace(/[^\w\s.,]/g, "").replace(/\s+/g, " ").trim();

				return [
					caption,
					captionParsedHashtags,
					...parsedHashtags,
					captionNoHashtags,
					captionNoEntities,
					captionOnlyUnicodeLetters,
					captionFirstSentence,
					captionMinimal
				]
				.filter((value, index, array) => !!value && index === array.indexOf(value))
				.filter(Boolean);
			}
		},
		isYoutube: {
			/** @returns {boolean} */
			get() { return CheckForLink(this.socialPost.postURL) === "Youtube"; }
		},
		baseFilename: {
			/** @returns {string} */
			get() {
				const platformName = CheckForLink(this.socialPost.postURL);

				const baseFilename = `${platformName} - ${
					this.results.author.raw?.trim()
				} - ${this.results.caption.raw?.trim()}${
					this.results.numeration.enabled && this.results.numeration.addingShotPrefix
						? " - Shot"
						: ""
				}`;

				return baseFilename;
			}
		},
		suggestedNumerationStart: {
			get() {
				/** @type {import("../util/gamephotography").GamePhotographyList} */
				const gamephotographyList = this.$store.getters.gamephotographyList;

				const matchingShots = gamephotographyList
					.filter((shot) => shot.startsWith(this.baseFilename.replace(/ - Shot$/, "")));
				
				const maxIndex = matchingShots
					.map((shot) => shot.replace(this.baseFilename, "").replace(/^ - Shot /, ""))
					.map((shotPart) => parseInt(shotPart))
					.filter(Boolean)
					.sort((a, b) => a - b)
					.pop();

				LogMessageOrError(matchingShots, maxIndex);

				if (maxIndex > 0) return maxIndex + 1;

				if (!matchingShots.length) return 0;
				return matchingShots.length + 1;
			}
		}
	},

	watch: {
		"results.author.raw": function() {
			if (this.suggestedNumerationStart > 0) {
				this.results.numeration.enabled = true;
				this.results.numeration.startingWith = this.suggestedNumerationStart;
			}
		},
		"results.caption.raw": function() {
			if (this.suggestedNumerationStart > 0) {
				this.results.numeration.enabled = true;
				this.results.numeration.startingWith = this.suggestedNumerationStart;
			}
		},
	},
	methods: {
		save() {
			const platformName = CheckForLink(this.socialPost.postURL);

			(this.isYoutube ? [this.results.youtube] : this.socialPost.medias).forEach((media, index) => {
				let filename = this.baseFilename;

				if (this.results.numeration.enabled || this.socialPost.medias.length > 1)
					filename += " " + (
						index + (this.results.numeration.enabled ? parseInt(this.results.numeration.startingWith) || 1 : 1)
					);

				if (this.results.quality.enabled && this.results.quality.label)
					filename += ` - ${this.results.quality.label?.trim()}`;

				const source = (media.filehash
					? API_METHODS.MediaDownloadURLByFilehash(media.filehash)
					: media.original || media.externalUrl);

				const extension = (media.filetype ||
					SafeParseURL(media.original || media.externalUrl).pathname
					.match(/\.(?<extension>\w+)(?:\:\w+)?$/)?.groups?.extension ||
					(platformName === "Youtube"
						? "mp4"
						: media.type === "gif"
						? "gif"
						: "jpg")
				);

				this.$store.commit("expandGamephotographyList", `${filename}.${extension}`);

				if (this.isYoutube)
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
<template>
	<footer class="footer">
		<section class="footer__section footer__section--logo">
			<img
				class="footer__logo-img"
				src="/img/icons/round/round_256x256.png"
				draggable="false"
				oncontextmenu="return false"
				alt="Social Picker"
			/>
			<div class="footer__logo-desc">
				<div class="footer__logo-desc__title default-title-font">Social Picker</div>
				<div>
					<i class="material-icons material-icons-round default-no-select">copyright</i>
					<span v-text="new Date().getFullYear()"></span>
				</div>
			</div>
		</section>

		<section class="footer__section">
			<div
				class="footer__section__item"
				v-for="(link, linkIndex) in footerLinks"
				:key="`footer-link-${linkIndex}`"
			>
				<i class="material-icons material-icons-round default-no-select" v-html="link.icon"></i>
				<a target="_blank" :href="link.href" v-text="$store.getters.i18n(link.text)"></a>
			</div>
		</section>

		<section class="footer__section">
			<div class="footer__section__item default-no-select default-pointer" @click="changeTheme">
				<i
					class="material-icons material-icons-round default-no-select"
					ref="theme-icon"
					:key="`theme-icon-${$store.getters.theme.icon}`"
					v-html="$store.getters.theme.icon"
				></i>
				<span
					ref="theme-name"
					:key="`theme-name-${$store.getters.theme.name}`"
					v-bind:data-theme-raw="$store.getters.theme.raw"
					v-bind:data-theme-name="$store.getters.theme.name"
					v-text="$store.getters.i18n($store.getters.theme.name)"
				></span>
			</div>

			<div class="footer__section__item default-no-select default-pointer" @click="clearCache">
				<i class="material-icons material-icons-round default-no-select">delete_outline</i>
				<span v-text="$store.getters.i18n('Clear cache')"></span>
			</div>
		</section>

		<section class="footer__section">
			<div class="footer__section__item default-no-select">
				<svg class="octicon" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
					<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
				</svg>
				<a href="https://github.com/serguun42/Social-Picker-Vue" target="_blank" rel="noopener noreferrer">Github</a>
			</div>

			<div class="footer__section__item default-no-select default-pointer">
				<i class="material-icons material-icons-round default-no-select">api</i>
				<a target="_blank" href="/docs/redoc.html">Redoc API</a>
			</div>

			<div class="footer__section__item default-no-select default-pointer">
				<i class="material-icons material-icons-round default-no-select">api</i>
				<span style="text-decoration: underline;" target="_blank" @click="openSwaggerAPI">Swagger API</span>
			</div>
		</section>
	</footer>
</template>

<script>
import Dispatcher from "@/util/dispatcher";
export default {
	name: "CustomFooter",
	data() {
		return {
			footerLinks: [
				{ icon: "home", href: "https://serguun42.ru", text: "home" },
				{ icon: "contact_mail", href: "https://serguun42.ru/?contacts", text: "contacts" },
				{ icon: "dashboard", href: "https://serguun42.ru/guide", text: "all services" },
				{ icon: "code", href: "https://serguun42.ru/about", text: "developed by" }
			]
		}
	},
	methods: {
		changeTheme() {
			this.$store.dispatch("changeTheme");
		},
		clearCache() {
			Dispatcher.call("clearCache", true);
		},
		openSwaggerAPI() {
			this.$store.commit("swaggerAPIShown");
		}
	}
}
</script>

<style>
.footer {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	align-items: center;
	position: relative;
	width: 100%;
	padding: 16px;
	margin: 16px 0 0;
	background-color: #444;
	color: #E1E1E1;
}

.is-dark .footer {
	background-color: #222;
}

.footer__section {
	--min-footer-section-width: 100%;
}

@media (min-width: 650.01px) and (max-width: 1200px) {
	.footer__section {
		--min-footer-section-width: 30%;
	}
}

@media (min-width: 1200.01px) {
	.footer__section {
		--min-footer-section-width: 20%;
	}
}

.footer__section {
	display: block;
	position: relative;
	min-width: var(--min-footer-section-width);
	padding: 16px;
	margin: 0;
}

.footer__section__item {
	display: block;
	position: relative;
	padding: 0;
	margin: 0 0 8px;
	font-weight: 400;
	font-size: 16px;
	line-height: 1.35em;
}

.footer .material-icons {
	vertical-align: -4px;
	font-size: 20px;
	margin-right: 4px;
	color: #E1E1E1;
}

.footer__section__item:last-of-type {
	margin: 0;
}

.footer__section__item a {
	color: #E1E1E1;
}

.footer__section--logo {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	user-select: none;
}

.footer__logo-img {
	display: block;
	position: relative;
	width: 64px;
	height: 64px;
	user-select: none;
}

.footer__logo-desc {
	display: block;
	position: relative;
	padding: 8px 16px;
	font-family: 'Roboto', 'Noto Sans', Arial, Helvetica, sans-serif;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.35em;
}

.footer__logo-desc__title {
	display: inline-block;
	font-size: 22px;
	text-align: left;
	margin-bottom: 8px;
}

.footer__section__item .octicon {
	width: 24px;
	height: 24px;
	margin-right: 8px;
	vertical-align: -6px;
	color: #E1E1E1;
	fill: #E1E1E1;
}
</style>

<template>
	<div
		class="message default-no-select default-pointer"
		:class="{ 'message--is-shown': $store.getters.message.shown }"
		@click="hide"
		v-html="$store.getters.message.text"
	></div>
</template>

<script>
export default {
	name: "Message",
	methods: {
		hide() {
			this.$store.dispatch("hideMessage");
		}
	}
}
</script>

<style>
.message {
	display: block;
	position: fixed;

	width: 100%;
	height: 40px;
	top: -200px;
	left: 0;

	margin: 0;
	padding: 8px;
	box-sizing: border-box;

	font-weight: 700;
	font-size: 16px;
	line-height: 24px;

	box-shadow: 0 1px 4px 1px rgb(100, 100, 100, 0.1);
	background-color: var(--message-background);
	color: var(--message-text);
	text-align: center;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	z-index: 10;

	transition: top 400ms ease-in-out 0s;
}

.message--is-shown {
	top: 0;
}

@media (min-width: 600px) {
	.message {
		width: 600px;
		height: 52px;
		left: calc(50% - 300px);

		margin: 0;
		padding: 16px;
		box-sizing: border-box;

		font-size: 18px;
		line-height: 20px;

		border-radius: 8px;
	}

	.message--is-shown {
		top: 16px;
	}
}
</style>
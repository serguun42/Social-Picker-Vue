<template>
	<div class="loader default-no-select" @contextmenu="(e) => { e.preventDefault(); return false }">
		<div class="loader__obfuscator"></div>
		<div class="loader__logo">
			<div class="loader__logo__waves">
				<div class="loader__logo__wave loader__logo__wave--1"></div>
				<div class="loader__logo__wave loader__logo__wave--2"></div>
				<div class="loader__logo__wave loader__logo__wave--3"></div>
				<div class="loader__logo__wave loader__logo__wave--4"></div>
			</div>

			<img
				class="loader__logo__image default-no-select"
				src="/img/icons/round/round_192x192.png"
				alt="Loading"
				ref="loader__logo__image"
				@contextmenu="(e) => { e.preventDefault(); return false }"
			>
		</div>
	</div>
</template>

<script>
export default {
	name: "Loader"
}
</script>

<style>
.loader {
	display: block;
	position: fixed;

	width: 100vw;
	height: 100vh;

	top: 0;
	left: 0;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.loader__obfuscator {
	display: block;
	position: absolute;

	width: 100%;
	height: 100%;

	top: 0;
	left: 0;
	opacity: 0.5;

	background-color: var(--background);
}

.loader__logo {
	display: block;
	position: absolute;

	width: 384px;
	height: 384px;

	left: calc(50% - 192px);
	top: calc(50% - 192px);
}

.loader__logo__image {
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex-wrap: nowrap;
	position: relative;

	width: 192px;
	height: 192px;

	margin: 96px;
	padding: 0;
	box-sizing: border-box;

	border-radius: 96px;
	overflow: hidden;
}

.loader__logo__waves {
	display: block;
	position: absolute;

	width: 384px;
	height: 384px;

	left: 0;
	top: 0;

	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.loader__logo__wave {
	display: block;
	position: absolute;

	width: 384px;
	height: 384px;

	left: 0;
	top: 0;

	border-radius: 192px;
	margin: 0;
	padding: 0;
	box-sizing: border-box;

	transform-origin: center center;

	background-color: var(--primary-faded-10);

	animation-name: waving;
	animation-duration: 2s;
	animation-timing-function: cubic-bezier(.79, .51, .42, 1);
	animation-delay: var(--animation-delay);
	animation-fill-mode: both;
	animation-iteration-count: infinite;
}

.loader__logo__wave--1 {
	--animation-delay: -1s;
}

.loader__logo__wave--2 {
	--animation-delay: -0.2s;
}

.loader__logo__wave--3 {
	--animation-delay: 0.4s;
}

.loader__logo__wave--4 {
	--animation-delay: 0.67s;
}

@keyframes waving {
	0% { transform: scale(0.4); opacity: 0.25; }
	75% { transform: scale(1); opacity: 1; }
	95% { transform: scale(1); opacity: 0; }
	98% { transform: scale(0.4); opacity: 0; }
	100% { transform: scale(0.4); opacity: 0.25; }
}
</style>
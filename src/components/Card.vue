<template>
	<div class="card" :class="{ 'card--no-padding': noPadding }">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "Card",
	props: {
		noPadding: {
			type: Boolean,
			required: false,
			default: false
		}
	}
}
</script>

<style>
.card {
	display: block;
	position: relative;
	width: calc(100% - 32px);
	max-width: 600px;

	margin: 16px auto;
	padding: 16px;

	overflow: hidden;

	background-color: var(--card-background);
	border-radius: 8px;
	box-shadow: 0 1px 6px 1px rgba(50, 50, 50, 0.15);
}

.card--no-padding {
	padding: 0;
}
</style>
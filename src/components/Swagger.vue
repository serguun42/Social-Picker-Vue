<template>
	<div id="swagger-ui-container"></div>
</template>

<script>
import SwaggerUI from "swagger-ui";
/** Comes with `swagger-ui` */
import YAML from "js-yaml";
import "swagger-ui/dist/swagger-ui.css";
import LogMessageOrError from "@/util/log";

export default {
	name: "Swagger",
	mounted() {
		/**
		 * Doing this magic to handle OpenAPI version 3.1.0 issue
		 */
		fetch("/docs/api.yml")
		.then((res) => {
			if (res.status !== 200)
				return Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`))

			return res.text();
		})
		.then((openapiYamlFile) => {
			SwaggerUI({
				spec: YAML.load(openapiYamlFile.replace(/(openapi\:\s3)\.\d+\.\d+/i, "openapi: 3.0.0")),
				dom_id: "#swagger-ui-container"
			});
		})
		.catch(LogMessageOrError);
	}
}
</script>

<style>
#swagger-ui-container {
	display: block;
	position: relative;
	width: 100%;
	min-height: calc(100% - 42px);
	min-height: calc(100vh - 42px);
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	background-color: #F1F1F1;
	overflow: hidden;
}
</style>
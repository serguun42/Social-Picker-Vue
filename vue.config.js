const { createHash } = require("crypto");
const { resolve } = require("path");
const { statSync, readFileSync } = require("fs");
const { readdir, writeFile } = require("fs/promises");
const { DefinePlugin } = require("webpack");
const WebpackSWPlugin = require("@serguun42/webpack-service-worker-plugin");

/**
 * @param {string} path
 * @returns {string}
 */
const ReadFileSafe = (path) => {
	try {
		const stats = statSync(path);
		if (!stats.isFile()) throw new Error(`${path} is not a file`);

		return readFileSync(path).toString();
	} catch (e) {
		return "";
	}
};

/**
 * @param {string} path
 * @param {any} data
 * @returns {Promise}
 */
const WriteFileSafe = (path, data) =>
	writeFile(path, data)
	.catch((e) => {
		process.stderr.write(`Cannot save ${path}`, e);
		return Promise.resolve();
	});

/**
 * @param {string} plain
 * @returns {string}
 */
const ReplaceWithEnvVariables = (plain) => plain
	.replace(
		/\$(?<variableName>\w+)/g,
		(match, variableName) => process.env[variableName] || match
	)
	.replace(
		/<%= (?<variableName>\w+) %>/g,
		(_match, variableName) => process.env[variableName] || variableName
	);

/** Environment variables */
const BUILD_HASH = createHash("md5").update(`BUILDSALT-${Date.now()}`).digest("hex");

/** Saving as `VUE_APP_…` so it'd be accessible from within Vue code */
process.env.VUE_APP_BUILD_HASH = BUILD_HASH;
WriteFileSafe(resolve("public", "build_hash"), BUILD_HASH);

const IS_DEV = (process.env.NODE_ENV === "development");
const DOT_ENV_PATH = resolve("src", "config", `${IS_DEV ? "local" : "production"}.env`);
const ENVIRONMENT_FILE = ReplaceWithEnvVariables(ReadFileSafe(DOT_ENV_PATH));

ENVIRONMENT_FILE.split("\n").forEach((line) => {
	if (line.search("=") < 0) return;

	const [ name, ...value ] = line.split("=");

	process.env[name] = value.join("=");
});

const definePlugin = new DefinePlugin({
	'IS_DEV': JSON.stringify(IS_DEV),
});



/**
 * @typedef {{[prop: string]: string | number | null | ManifesType}} ManifesType
 *
 * @param {ManifesType} manifestPart
 * @returns {ManifesType}
 */
const ManifestTemplateHandler = (manifestPart) => {
	const newManifestPart = {};

	Object.keys(manifestPart).forEach((key) => {
		if (typeof manifestPart[key] === "object") {
			if (manifestPart[key] instanceof Array)
				newManifestPart[key] = manifestPart[key].map((subValue) => ManifestTemplateHandler(subValue));
			else
				newManifestPart[key] = ManifestTemplateHandler(manifestPart[key]);
		} else if (typeof manifestPart[key] === "string")
			newManifestPart[key] = ReplaceWithEnvVariables(manifestPart[key]);
		else
			newManifestPart[key] = manifestPart[key];
	});

	return newManifestPart;
};

const MANIFEST_BASE = JSON.parse(ReadFileSafe(resolve("src", "config", "manifest.base.json")));
const builtManifest = ManifestTemplateHandler(MANIFEST_BASE);

WriteFileSafe(resolve("public", "manifest.json"), JSON.stringify(builtManifest, false, "\t"));
WriteFileSafe(resolve("public", "manifest.webmanifest"), JSON.stringify(builtManifest, false, "\t"));



/** I18N */
readdir("./src/config/i18n/")
.then((i18nFiles) => {
	const filteredDictionaries = i18nFiles.filter((file) => /(?<!^list)\.json$/.test(file));

	return WriteFileSafe("./src/config/i18n/list.json", JSON.stringify(filteredDictionaries, false, "\t"));
})
.catch((e) => process.stderr.write("Cannot create list of i18n .json files", e));



/** @type {import("@vue/cli-service").ProjectOptions} */
const DEV_VUE_CONFIG = {
	/** @type {import("webpack").Configuration} */
	configureWebpack: {
		mode: "development",
		output: {
			pathinfo: false
		},
		plugins: [
			definePlugin
		],
		devServer: {
			host: "localhost",
			port: process.env.DEV_LOCAL_PORT,

			server: process.env.DEV_LOCAL_HTTPS_KEY_PATH && process.env.DEV_LOCAL_HTTPS_CERT_PATH
				? {
					type: "https",
					options: {
						key: ReadFileSafe(process.env.DEV_LOCAL_HTTPS_KEY_PATH),
						cert: ReadFileSafe(process.env.DEV_LOCAL_HTTPS_CERT_PATH),
					}
				}
				: undefined,

			proxy: {
				"^/resources/": {
					target: process.env.DEV_RESOURCE_TARGET
				},
				"^/request": {
					target: process.env.DEV_API_TARGET,
					headers: process.env.DEV_API_TARGET_HEADERS ? JSON.parse(process.env.DEV_API_TARGET_HEADERS) : {},
					changeOrigin: true
				},
				"^/api/": {
					target: process.env.DEV_API_TARGET,
					headers: process.env.DEV_API_TARGET_HEADERS ? JSON.parse(process.env.DEV_API_TARGET_HEADERS) : {},
					changeOrigin: true
				}
			}
		},
	},

	publicPath: process.env.VUE_APP_RELATIVE_PATH,

	productionSourceMap: true
};

/** @type {import("@vue/cli-service").ProjectOptions} */
const PROD_VUE_CONFIG = {
    configureWebpack: {
		mode: "production",
		output: {
			pathinfo: false
		},
		plugins: [
			definePlugin,
			new WebpackSWPlugin({
				source: "src/service-worker.js",
				output: "service-worker.js",
			})
		]
	},

	publicPath: process.env.VUE_APP_RELATIVE_PATH,

    productionSourceMap: false
};

module.exports = (IS_DEV ? DEV_VUE_CONFIG : PROD_VUE_CONFIG);

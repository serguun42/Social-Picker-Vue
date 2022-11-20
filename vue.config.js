const { createHash } = require("crypto");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const { readdir, writeFile } = require("fs/promises");
const { DefinePlugin } = require("webpack");
const WebpackSWPlugin = require("@serguun42/webpack-service-worker-plugin");

/**
 * @param {import("fs").PathOrFileDescriptor}
 * @returns {string}
 */
const ReadFileWrapper = (path) => {
	try {
		return readFileSync(path).toString();
	} catch (e) {
		return "";
	}
};

/** Environment variables */
const IS_DEV = (process.env.NODE_ENV === "development");
const BUILD_HASH = createHash("md5").update(`BUILDSALT-${Date.now()}`).digest("hex");
const GENERAL_DOT_ENV = resolve("src", "config", `${IS_DEV ? "local" : "production"}.env`);
const ENVIRONMENT_FILE = ReadFileWrapper(GENERAL_DOT_ENV)
						.replace(
							/\$(?<variableName>\w+)/g,
							(match, variableName) => process.env[variableName] || match
						)
						.replace(/__BUILD_HASH__/, BUILD_HASH);

ENVIRONMENT_FILE.split("\n").forEach((line) => {
	if (line.search("=") < 0) return;

	const [ name, ...value ] = line.split("=");

	process.env[name] = value.join("=");
});

writeFile(resolve("public", "build_hash"), BUILD_HASH)
.catch((e) => process.stderr.write("Cannot save build_hash", e));


/** @typedef {{[prop: string]: string | number | null | ManifesType}} ManifesType */
/**
 * @param {ManifesType} manifestPart
 * @returns {ManifesType}
 */
const ManifestTemplateHandler = (manifestPart) => {
	const builtPart = {};

	Object.keys(manifestPart).forEach((key) => {
		if (typeof manifestPart[key] === "object") {
			if (manifestPart[key] instanceof Array)
				builtPart[key] = manifestPart[key].map((subValue) => ManifestTemplateHandler(subValue));
			else
				builtPart[key] = ManifestTemplateHandler(manifestPart[key]);
		} else if (typeof manifestPart[key] === "string")
			builtPart[key] = manifestPart[key]
				.replace(/<%= ([\w\.]+) %>/g, (_match, variable) =>
					process.env[variable] || "–"
				);
		else
			builtPart[key] = manifestPart[key];
	});

	return builtPart;
};

const MANIFEST_BASE = JSON.parse(ReadFileWrapper(resolve("src", "config", "manifest.base.json")));
const builtManifest = ManifestTemplateHandler(MANIFEST_BASE);

writeFile(resolve("public", "manifest.json"), JSON.stringify(builtManifest, false, "\t"))
.then(() => writeFile(resolve("public", "manifest.webmanifest"), JSON.stringify(builtManifest, false, "\t")))
.catch((e) => process.stderr.write("Cannot save WebManifest", e));




/** I18N */
readdir("./src/config/i18n/")
.then((i18nFiles) => {
	const filteredDictionaries = i18nFiles.filter((file) => /(?<!^list)\.json$/.test(file));

	return writeFile("./src/config/i18n/list.json", JSON.stringify(filteredDictionaries, false, "\t"));
})
.catch((e) => process.stderr.write("Cannot create list of i18n .json files", e));



/** @type {import("webpack").Resolve} */
const WEBPACK_RESOLVE_OPTIONS = {
	alias: {
		"@": resolve("src")
	}
};

const definePlugin = new DefinePlugin({
	IS_DEV: JSON.stringify(IS_DEV)
});


/** @type {import("@vue/cli-service").ProjectOptions} */
const DEV_VUE_CONFIG = {
	/** @type {import("webpack").Configuration} */
	configureWebpack: {
		mode: "development",
		output: {
			pathinfo: false
		},
		resolve: WEBPACK_RESOLVE_OPTIONS,
		plugins: [
			definePlugin
		],
		devServer: {
			host: "localhost",
			port: process.env.DEV_LOCAL_PORT,

			server: process.env.DEV_LOCAL_HTTPS_KEY_PATH & process.env.DEV_LOCAL_HTTPS_CERT_PATH
				? {
					options: {
						key: ReadFileWrapper(process.env.DEV_LOCAL_HTTPS_KEY_PATH),
						cert: ReadFileWrapper(process.env.DEV_LOCAL_HTTPS_CERT_PATH),
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
		resolve: WEBPACK_RESOLVE_OPTIONS,
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

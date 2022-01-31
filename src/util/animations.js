import ANIMATIONS_CONFIG from "../config/animations.json";


/** Add CSS variables based on config */
const styleBlockWithAnimationsContent = Object.keys(ANIMATIONS_CONFIG).map((animationName) => {
	const animationValue = (
		/ms$/i.test(animationName) ?
			`${ANIMATIONS_CONFIG[animationName]}ms`
		:
			/s$/i.test(animationName) ?
			`${ANIMATIONS_CONFIG[animationName]}s`
		:
			ANIMATIONS_CONFIG[animationName]
		);

	return `\t--${animationName}: ${animationValue};`;
}).join("\n");

if (document.getElementById("style-block-with-animations")) {
	document.getElementById("style-block-with-animations").innerHTML += `\n\n:root {\n${styleBlockWithAnimationsContent}\n}`;
} else {
	const styleBlockWithAnimations = document.createElement("style");
		  styleBlockWithAnimations.id = "style-block-with-animations";
		  styleBlockWithAnimations.innerHTML = `:root {\n${styleBlockWithAnimationsContent}\n}`;

	document.head.appendChild(styleBlockWithAnimations);
}


/**
 * @callback AnimationStyleSettingFunc
 * @param {number} iProgress
 */
/**
 * @param {number} iDuration
 * @param {AnimationStyleSettingFunc} iStyleSettingFunc - Function for setting props by progress
 * @param {"ease-in-out"|"ease-in-out-slow"|"ease-in"|"ease-out"|"ripple"|"linear"} [iCurveStyle="ease-in-out-slow"] - Curve Style
 * @param {number} [iSkipProgress=0] - How many of progress to skip, ranges from `0` to `1`
 * @returns {Promise<null>}
 */
export const GlobalAnimation = (iDuration, iStyleSettingFunc, iCurveStyle = "ease-in-out-slow", iSkipProgress = 0) => new Promise((resolve) => {
	const startTime = performance.now();

	const LocalAnimation = iPassedTime => {
		iPassedTime = iPassedTime - startTime;
		if (iPassedTime < 0) iPassedTime = 0;

		let cProgress = iPassedTime / iDuration + iSkipProgress;
		if (cProgress < 1) {
			if (iCurveStyle == "ease-in-out") {
				if (cProgress < 0.5)
					cProgress = Math.pow(cProgress * 2, 2.75) / 2;
				else
					cProgress = 1 - Math.pow((1 - cProgress) * 2, 2.75) / 2;
			} else if (iCurveStyle == "ease-in-out-slow") {
				if (cProgress < 0.5)
					cProgress = Math.pow(cProgress * 2, 2.25) / 2;
				else
					cProgress = 1 - Math.pow((1 - cProgress) * 2, 2.25) / 2;
			} else if (iCurveStyle == "ease-in") {
				cProgress = Math.pow(cProgress, 1.75);
			} else if (iCurveStyle == "ease-out") {
				cProgress = 1 - Math.pow(1 - cProgress, 1.75);
			} else if (iCurveStyle == "ripple") {
				cProgress = 0.6 * Math.pow(cProgress, 1/3) + 1.8 * Math.pow(cProgress, 2/3) - 1.4 * cProgress;
			}

			iStyleSettingFunc(cProgress);

			requestAnimationFrame(LocalAnimation);
		} else {
			iStyleSettingFunc(1);

			return resolve();
		}
	};

	requestAnimationFrame(LocalAnimation);
});

/**
 * @typedef {Object} AnimationsOptionsType
 * @property {"block" | "flex" | "etc"} [display]
 * @property {number} [initialOpacity]
 */
/**
 * @param {HTMLElement} iElem
 * @param {number} iDuration
 * @param {AnimationsOptionsType} [iOptions]
 * @returns {Promise<string>}
 */
export const FadeIn = (iElem, iDuration, iOptions) => {
	if (!iElem || !(iElem instanceof HTMLElement)) return Promise.resolve();
	if (!iOptions) iOptions = {};
	if (!iOptions.initialOpacity) iOptions.initialOpacity = 0;
	if (!iOptions.display) iOptions.display = "block";

	iElem.style.opacity = iOptions.initialOpacity;
	iElem.style.display = iOptions.display;

	return GlobalAnimation(iDuration, (iProgress) => {
		iElem.style.opacity = (1 - iOptions.initialOpacity) * iProgress + iOptions.initialOpacity;
	}, "ease-in-out").then(() => {
		iElem.style.opacity = 1;
		return Promise.resolve("Done FadeIn");
	});
};

/**
 * @param {HTMLElement} iElem
 * @param {number} iDuration
 * @param {AnimationsOptionsType} [iOptions]
 * @returns {Promise<string>}
 */
export const FadeOut = (iElem, iDuration, iOptions) => {
	if (!iElem || !(iElem instanceof HTMLElement)) return Promise.resolve();
	if (!iOptions) iOptions = {};
	if (!iOptions.initialOpacity) iOptions.initialOpacity = 1;

	iElem.style.opacity = iOptions.initialOpacity;

	return GlobalAnimation(iDuration, (iProgress) => {
		iElem.style.opacity = (1 - iProgress) * iOptions.initialOpacity;
	}, "ease-in-out").then(() => {
		iElem.style.opacity = 0;
		iElem.style.display = "none";
		return Promise.resolve("Done FadeOut");
	});
};

/**
 * @param {HTMLElement} iElem
 * @param {number} iDuration
 * @param {AnimationsOptionsType} [iOptions]
 * @param {AnimationStyleSettingFunc} [iStyleSettingFunc]
 * @returns {Promise<string>}
 */
export const SlideDown = (iElem, iDuration, iOptions, iStyleSettingFunc) => {
	if (!iElem || !(iElem instanceof HTMLElement)) return Promise.resolve();
	if (!iOptions) iOptions = {};
	if (!iOptions.display) iOptions.display = "block";

	const finalHeight = parseInt(iElem.dataset.targetHeight || getComputedStyle(iElem).height || "0") || (() => {
		iElem.style.opacity = 0;
		iElem.style.display = iOptions.display;
		const heightGorFromTweak = parseInt(iElem.dataset.targetHeight || getComputedStyle(iElem).height || "0") || 0;
		iElem.style.display = "none";
		iElem.style.opacity = 1;
		return heightGorFromTweak;
	})() || 0;

	const marginTop = parseInt(getComputedStyle(iElem).marginTop || "0") || 0,
		  marginBottom = parseInt(getComputedStyle(iElem).marginBottom || "0") || 0,
		  paddingTop = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0,
		  paddingBottom = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0;

	iElem.style.display = iOptions.display;
	iElem.style.overflow = "hidden";
	iElem.style.height = 0;
	iElem.style.marginTop = 0;
	iElem.style.marginBottom = 0;
	iElem.style.paddingTop = 0;
	iElem.style.paddingBottom = 0;
	iElem.dataset.targetHeight = finalHeight;

	return GlobalAnimation(iDuration, (iProgress) => {
		iElem.style.height = `${iProgress * finalHeight}px`;
		iElem.style.marginTop = `${iProgress * marginTop}px`;
		iElem.style.marginBottom = `${iProgress * marginBottom}px`;
		iElem.style.paddingTop = `${iProgress * paddingTop}px`;
		iElem.style.paddingBottom = `${iProgress * paddingBottom}px`;

		if (iStyleSettingFunc) iStyleSettingFunc(iProgress);
	}, "ease-in-out").then(() => {
		iElem.style.height = `${finalHeight}px`;
		iElem.style.removeProperty("height");
		iElem.style.removeProperty("overflow");
		iElem.style.removeProperty("margin-top");
		iElem.style.removeProperty("margin-bottom");
		iElem.style.removeProperty("padding-top");
		iElem.style.removeProperty("padding-bottom");
		return Promise.resolve("Done SlideDown");
	});
};

/**
 * @param {HTMLElement} iElem
 * @param {number} iDuration
 * @param {AnimationStyleSettingFunc} [iStyleSettingFunc]
 * @returns {Promise<string>}
 */
export const SlideUp = (iElem, iDuration, iStyleSettingFunc) => {
	if (!iElem || !(iElem instanceof HTMLElement)) return Promise.resolve();

	const initSize = iElem.clientHeight,
		  marginTop = parseInt(getComputedStyle(iElem).marginTop || "0") || 0,
		  marginBottom = parseInt(getComputedStyle(iElem).marginBottom || "0") || 0,
		  paddingTop = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0,
		  paddingBottom = parseInt(getComputedStyle(iElem).paddingTop || "0") || 0;

	iElem.style.overflow = "hidden";

	return GlobalAnimation(iDuration, (iProgress) => {
		iElem.style.height = `${(1 - iProgress) * initSize}px`;
		iElem.style.marginTop = `${(1 - iProgress) * marginTop}px`;
		iElem.style.marginBottom = `${(1 - iProgress) * marginBottom}px`;
		iElem.style.paddingTop = `${(1 - iProgress) * paddingTop}px`;
		iElem.style.paddingBottom = `${(1 - iProgress) * paddingBottom}px`;

		if (iStyleSettingFunc) iStyleSettingFunc(iProgress);
	}, "ease-in-out").then(() => {
		iElem.style.display = "none";
		iElem.style.removeProperty("height");
		iElem.style.removeProperty("overflow");
		iElem.style.removeProperty("margin-top");
		iElem.style.removeProperty("margin-bottom");
		iElem.style.removeProperty("padding-top");
		iElem.style.removeProperty("padding-bottom");
		return Promise.resolve("Done SlideUp");
	});
};




export const ANIMATIONS = {
	MESSAGE_SHOWN_TIME_MS: ANIMATIONS_CONFIG.MESSAGE_SHOWN_TIME_MS,
	VIEW_SWITCHING_MS: ANIMATIONS_CONFIG.VIEW_SWITCHING_MS,
	AUTO_OPENER_WAITING_S: ANIMATIONS_CONFIG.AUTO_OPENER_WAITING_S,
	AUTO_OPENER_SLIDING_MS: ANIMATIONS_CONFIG.AUTO_OPENER_SLIDING_MS,
	CATEGORY_OBFUSCATOR_FADING_MS: ANIMATIONS_CONFIG.CATEGORY_OBFUSCATOR_FADING_MS,
};

export default {
	ANIMATIONS,
	GlobalAnimation,
	FadeIn,
	FadeOut,
	SlideDown,
	SlideUp
};

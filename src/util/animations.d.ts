export function GlobalAnimation(iDuration: number, iStyleSettingFunc: AnimationStyleSettingFunc, iCurveStyle?: "ease-in-out" | "ease-in-out-slow" | "ease-in" | "ease-out" | "ripple" | "linear", iSkipProgress?: number): Promise<null>;
export function FadeIn(iElem: HTMLElement, iDuration: number, iOptions?: AnimationsOptionsType): Promise<string>;
export function FadeOut(iElem: HTMLElement, iDuration: number, iOptions?: AnimationsOptionsType): Promise<string>;
export function SlideDown(iElem: HTMLElement, iDuration: number, iOptions?: AnimationsOptionsType, iStyleSettingFunc?: AnimationStyleSettingFunc): Promise<string>;
export function SlideUp(iElem: HTMLElement, iDuration: number, iStyleSettingFunc?: AnimationStyleSettingFunc): Promise<string>;
export namespace ANIMATIONS {
    const MESSAGE_SHOWN_TIME_MS: any;
    const VIEW_SWITCHING_MS: any;
    const AUTO_OPENER_WAITING_S: any;
    const AUTO_OPENER_SLIDING_MS: any;
    const CATEGORY_OBFUSCATOR_FADING_MS: any;
}
declare namespace _default {
    export { ANIMATIONS };
    export { GlobalAnimation };
    export { FadeIn };
    export { FadeOut };
    export { SlideDown };
    export { SlideUp };
}
export default _default;
export type AnimationStyleSettingFunc = (iProgress: number) => any;
export type AnimationsOptionsType = {
    display?: "block" | "flex" | "etc";
    initialOpacity?: number;
};

export function GetCompleteTheme(themeRawParam?: ThemeEnum): ThemeObject;
declare namespace _default {
    export { GetCompleteTheme };
}
export default _default;
export type ThemeEnum = "light" | "dark" | "schedule" | "system";
export type ThemeObject = {
    raw: ThemeEnum;
    isDark: boolean;
    icon: string;
    name: string;
};

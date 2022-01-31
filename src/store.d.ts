export default store;
declare const store: import("vuex").Store<{
    i18n: any;
    /** @type {import("./util/theme").ThemeObject} */
    theme: import("./util/theme").ThemeObject;
    message: {
        text: string;
        shown: boolean;
    };
    lastMessageID: string;
    swaggerAPIShown: boolean;
    stamp: number;
    accountPermission: boolean;
    permissionToPaste: boolean;
    /** @type {import("./types").SocialPost} */
    socialPost: import("./types").SocialPost;
}>;

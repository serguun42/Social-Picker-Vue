export function FetchMethod(method: string, queries?: {
    [queryName: string]: string | true;
}, options?: RequestInit & {
    safeAsBlob: boolean;
}): Promise<import("../types").DefaultError>;
export namespace API_METHODS {
    export { AccountCheck };
    export { MediaPick };
    export { MediaDownloadURLByFilehash };
    export { MediaDownloadURLForCORS };
}
declare namespace _default {
    export { API_METHODS };
    export { FetchMethod };
}
export default _default;
/**
 * @returns {Promise<{ success: boolean } & import("../types").DefaultError>}
 */
declare function AccountCheck(): Promise<{
    success: boolean;
} & import("../types").DefaultError>;
/**
 * @param {string} url
 * @returns {Promise<import("../types").SocialPost & import("../types").DefaultError>}
 */
declare function MediaPick(url: string): Promise<import("../types").SocialPost & import("../types").DefaultError>;
/**
 * @param {string} filehash
 * @returns {string}
 */
declare function MediaDownloadURLByFilehash(filehash: string): string;
/**
 * @param {string} link
 * @returns {string}
 */
declare function MediaDownloadURLForCORS(link: string): string;

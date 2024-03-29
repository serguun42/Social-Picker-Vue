
/**
 * Returns URL if it's correct
 * 
 * @param {string} givenURL
 * @returns {URL | false}
 */
export const SafeParseURL = (givenURL) => {
	try {
		return new URL(givenURL);
	} catch (e) {
		return false;
	}
}

/**
 * Returns platform name if link is correct
 * 
 * @param {string} givenURL
 * @returns {string | false}
 */
export const CheckForLink = (givenURL) => {
	const url = SafeParseURL(givenURL);
	if (!url) return false;

	if (
		url.hostname === "twitter.com" ||
		url.hostname === "www.twitter.com" ||
		url.hostname === "mobile.twitter.com" ||
		url.hostname === "x.com" ||
		url.hostname === "www.x.com" ||
		url.hostname === "mobile.x.com" ||
		url.hostname === "nitter.net" ||
		url.hostname === "www.nitter.net" ||
		url.hostname === "mobile.nitter.net" ||
		url.hostname === "vxtwitter.com"
	)
		return "Twitter";
	else if (
		url.hostname === "pbs.twimg.com" ||
		url.hostname === "video.twimg.com"
	)
		return "Twitter";
	else if (
		url.hostname === "instagram.com" ||
		url.hostname === "www.instagram.com"
	)
		return "Instagram";
	else if (
		url.hostname === "reddit.com" ||
		url.hostname === "www.reddit.com" ||
		url.hostname === "old.reddit.com" ||
		url.hostname === "redd.it"
	)
		return "Reddit";
	else if (
		url.hostname === "pixiv.net" ||
		url.hostname === "www.pixiv.net" ||
		url.hostname === "i.pximg.net"
	)
		return "Pixiv";
	else if (
		/tumblr\.(com|co\.\w+|org)$/i.test(url.hostname || "")
	)
		return "Tumblr";
	else if (
		url.hostname === "danbooru.donmai.us" ||
		url.origin === "https://danbooru.donmai.us"
	)
		return "Danbooru";
	else if (
		url.hostname === "gelbooru.com" ||
		url.hostname === "www.gelbooru.com"
	)
		return "Gelbooru";
	else if (
		url.hostname === "konachan.com" ||
		url.hostname === "konachan.net" ||
		url.hostname === "www.konachan.com" ||
		url.hostname === "www.konachan.net"
	)
		return "Konachan";
	else if (
		url.hostname === "yande.re" ||
		url.hostname === "www.yande.re"
	)
		return "Yandere";
	else if (
		url.hostname === "e-shuushuu.net" ||
		url.hostname === "www.e-shuushuu.net"
	)
		return "Eshuushuu";
	else if (
		url.hostname === "chan.sankakucomplex.com" ||
		url.origin === "https://chan.sankakucomplex.com"
	)
		return "Sankaku";
	else if (
		url.hostname === "zerochan.net" ||
		url.hostname === "www.zerochan.net"
	)
		return "Zerochan";
	else if (
		url.hostname === "anime-pictures.net" ||
		url.hostname === "www.anime-pictures.net"
	)
		return "Anime-Pictures";
	else if (
		url.hostname === "kemono.party" ||
		url.hostname === "kemono.su" ||
		url.hostname === "www.kemono.party" ||
		url.hostname === "beta.kemono.party"
	)
		return "Kemono";
	else if (
		url.hostname === "youtube.com" ||
		url.hostname === "www.youtube.com" ||
		url.hostname === "youtu.be" ||
		url.hostname === "m.youtube.com"
	)
		return "Youtube";
	else if (
		url.hostname === "tjournal.ru" ||
		url.hostname === "the.tj" ||
		url.hostname === "dtf.ru" ||
		url.hostname === "vc.ru"
	)
		return "Osnova";
	else if (/^(m\.|img\d+\.)?(joy|safe|anime\.|porn|fap)?reactor\.(cc|com)$/.test(url.hostname))
		return "Joyreactor";
	else if (url.hostname === "coub.com")
		return "Coub";
	else if (/(\w+\.)?tiktok\.com$/.test(url.hostname))
		return "Tiktok";
	else
		return false;
};

/**
 * Returns username for certain platforms from link
 * 
 * @param {string} givenURL
 * @returns {string}
 */
export const CheckForDisplayName = (givenURL) => {
	const url = SafeParseURL(givenURL);
	if (!url) return false;

	if (
		url.hostname === "twitter.com" ||
		url.hostname === "www.twitter.com" ||
		url.hostname === "mobile.twitter.com" || 
		url.hostname === "nitter.net" ||
		url.hostname === "www.nitter.net" ||
		url.hostname === "mobile.nitter.net" ||
		url.hostname === "instagram.com" ||
		url.hostname === "www.instagram.com"
	)
		return url.pathname.match(/^\/(?<displayName>[^\/]+)/)?.groups?.["displayName"] || "";
	else if (
		url.hostname === "reddit.com" ||
		url.hostname === "www.reddit.com"
	)
		return url.pathname.match(/^\/(u|user)\/(?<displayName>[^\/]+)/)?.groups?.["displayName"] || "";
	else
		return "";
};


export default {
	SafeParseURL,
	CheckForLink,
	CheckForDisplayName
};

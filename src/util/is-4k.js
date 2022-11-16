/**
 * @param {import('../types').SocialPost} socialPost
 * @returns {boolean}
 */
const Is4K = (socialPost) => socialPost.medias.some((media) => {
	if (!media.description) return false;

	const twitterDescriptionMatch = media.description.match(/^(?<width>\d+)x(?<height>\d+)$/i);
	const youtubeDescriptionMatch = media.description.match(/^(?<height>\d+)p/i);
	
	if (twitterDescriptionMatch) {
		const width = parseInt(twitterDescriptionMatch.groups?.width);
		const height = parseInt(twitterDescriptionMatch.groups?.height);
		if (!width || !height) return false;

		return width * height > 3000 * 1500;
	}
	
	if (youtubeDescriptionMatch) {
		const height = parseInt(youtubeDescriptionMatch.groups?.height);
		return height > 1440;
	}

	return false;
});

export default Is4K;

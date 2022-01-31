export type Media = {
	type: "photo" | "gif" | "video" | "audio";
	externalUrl: string;
	original?: string;
	/** Combined local copy of file identified by its hash */
	filehash?: string;
	/** File extension */
	filetype?: string;
	otherSources?: { [otherSourceOriginKey: string]: string };
	/** Media description e.g. youtube video quality or image size */
	description?: string;
	/** Media total filesize if known (in bytes) */
	filesize?: number;
};

export type SocialPost = {
	caption: string;
	author: string;
	authorURL: string;
	postURL: string;
	medias: Media[];
}

export type DefaultError = {
    error: true;
    code: number;
    reason: string;
}

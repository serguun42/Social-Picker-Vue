import LogMessageOrError from "./log";

/** @typedef {string[]} GamePhotographyList List of all saved file names (without game-folders names) */
const LOCAL_STORAGE_ORIGINAL_LIST_KEY = "gamephotography-original-list";
const LOCAL_STORAGE_USER_LIST_KEY = "gamephotography-user-list";
const REMOTE_LOCATION_OF_ORIGINAL_LIST = "https://gamephotography.serguun42.ru/joint.json";

/**
 * @param {GamePhotographyList} list
 * @returns {GamePhotographyList}
 */
const CleanList = (list) => {
	if (!Array.isArray(list)) return [];

	return list
		.filter((shot) => typeof shot === "string" && !!shot)
		.map((shot) => shot.split("/").pop())
		.filter((shot, index, array) => index === array.indexOf(shot));
};

/**
 * @param {GamePhotographyList} originalList
 * @param {GamePhotographyList} userList
 * @returns {GamePhotographyList}
 */
const FilterList = (originalList, userList) => {
	if (!Array.isArray(originalList)) return false;
	if (!Array.isArray(userList)) return false;

	return userList.filter((shot) => !!shot && !originalList.includes(shot));
};

/**
 * @param {GamePhotographyList} a
 * @param {GamePhotographyList} b
 * @returns {boolean}
 */
export const CompareLists = (a, b) => {
	if (!Array.isArray(a)) return false;
	if (!Array.isArray(b)) return false;

	return a.sort().toString() === b.sort().toString();
};

/**
 * @param {string} localStorageKey
 * @returns {GamePhotographyList}
 */
const GetLocalListVariant = (localStorageKey) => {
	const rawList = localStorage.getItem(localStorageKey);
	if (!rawList) return [];

	try {
		const parsedList = JSON.parse(rawList);
		if (!Array.isArray(parsedList)) return [];
		return CleanList(parsedList);
	} catch (e) {
		return [];
	}
};

/**
 * @param {string} localStorageKey
 * @param {GamePhotographyList} list
 */
const SaveLocalList = (localStorageKey, list) => {
	if (!Array.isArray(list)) return;

	localStorage.setItem(localStorageKey, JSON.stringify(CleanList(list)));
};

/**
 * Get List from localStorage
 * @returns {GamePhotographyList}
 */
export const GetLocalList = () => {
	const originalLocalList = GetLocalListVariant(LOCAL_STORAGE_ORIGINAL_LIST_KEY);
	const userList = GetLocalListVariant(LOCAL_STORAGE_USER_LIST_KEY);

	const userFilteredList = FilterList(originalLocalList, userList);
	SaveLocalList(LOCAL_STORAGE_USER_LIST_KEY, userFilteredList);

	return originalLocalList.concat(userFilteredList);
};

/**
 * @param {string} newShot
 * @returns {GamePhotographyList}
 */
export const ExpandUserList = (newShot) => {
	const originalLocalList = GetLocalListVariant(LOCAL_STORAGE_ORIGINAL_LIST_KEY);
	const userList = CleanList(GetLocalListVariant(LOCAL_STORAGE_USER_LIST_KEY).concat(newShot));

	const userFilteredList = FilterList(originalLocalList, userList);
	SaveLocalList(LOCAL_STORAGE_USER_LIST_KEY, userFilteredList);

	return originalLocalList.concat(userFilteredList);
};

/**
 * Fetch List from Game Photography site and
 * @returns {Promise<GamePhotographyList>}
 */
export const FetchRemoteList = () =>
	fetch(REMOTE_LOCATION_OF_ORIGINAL_LIST)
		.then((res) => {
			if (res.ok) return res.json();

			return Promise.reject(new Error(`Status code ${res.status} ${res.statusText} (${res.url})`));
		})
		.then(
			/** @param {GamePhotographyList} originalFreshList */ (originalFreshList) => {
				if (!Array.isArray(originalFreshList))
					return Promise.reject(new Error(`<originalFreshList> is not an array`));

				const cleanFreshList = CleanList(originalFreshList);
				const originalLocalList = GetLocalListVariant(LOCAL_STORAGE_ORIGINAL_LIST_KEY);

				if (!CompareLists(cleanFreshList, originalLocalList)) {
					SaveLocalList(LOCAL_STORAGE_ORIGINAL_LIST_KEY, cleanFreshList);
					SaveLocalList(LOCAL_STORAGE_USER_LIST_KEY, []);

					return Promise.resolve(cleanFreshList);
				}

				const userList = GetLocalListVariant(LOCAL_STORAGE_USER_LIST_KEY);
				const userFilteredList = FilterList(originalLocalList, userList);
				SaveLocalList(LOCAL_STORAGE_USER_LIST_KEY, userFilteredList);

				return Promise.resolve(originalLocalList.concat(userFilteredList));
			}
		)
		.catch((e) => {
			LogMessageOrError(e);
			return Promise.resolve([]);
		});

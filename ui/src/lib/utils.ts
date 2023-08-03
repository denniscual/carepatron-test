/**
 * Searches an array of objects, filtering based on the specified search term and keys.
 * The function performs a case-insensitive substring match on the specified keys.
 *
 * NOTE: This is a naive search/filtering algorithm. If the dataset is huge, then better to use
 * update the function or use an established solution.
 */
export function searchItems<T>(items: T[], term: string, keys: (keyof T)[]): T[] {
	if (term === '') {
		return items;
	}

	term = term.toLowerCase();

	return items.filter((item) => {
		return keys.some((key) => String(item[key]).toLowerCase().includes(term));
	});
}

/**
 * Create FormData instance based on the passed object.
 */
export function createFormData(object: Record<string, string>) {
	const formData = new FormData();

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const value = object[key];
			formData.append(key, value);
		}
	}

	return formData;
}

/**
 * Generate a time-based sortable id.
 */
export function generateId() {
	// get current timestamp in milliseconds (total milliseconds since 1970/01/01)
	const timestamp = Date.now();
	// convert it to a base36 string (numbers + letters, case-insensitive)
	const timestampPart = timestamp.toString(36);
	// generate a random base36 string
	const randomPart = Math.random().toString(36).substring(2, 10);
	return timestampPart + randomPart;
}

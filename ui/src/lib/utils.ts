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

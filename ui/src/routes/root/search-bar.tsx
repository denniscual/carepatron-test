import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Search } from '@mui/icons-material';
import { ElementRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ query }: { query: string }) {
	const searchRef = useRef<ElementRef<'input'>>(null);
	const navigate = useNavigate();

	// Synchronize input value with the URL Search Params
	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.value = query;
		}
	}, [query]);

	return (
		<FormControl sx={{ width: '35ch' }} variant='outlined'>
			<InputLabel htmlFor='search-clients'>Search clients...</InputLabel>
			<OutlinedInput
				ref={searchRef}
				type='search'
				endAdornment={
					<InputAdornment position='end'>
						<Search />
					</InputAdornment>
				}
				label='Search clients...'
				defaultValue={query}
				onChange={(event) => {
					const { value } = event.currentTarget;
					// Managing history stack
					const isFirstSearch = query === '';
					// Create new stack if the query is empty. Else, update the search params while replacing the current stack.
					// In this way, we can avoid polluting the history stack.
					navigate(`/?${new URLSearchParams({ q: value })}`, {
						replace: !isFirstSearch,
					});
				}}
			/>
		</FormControl>
	);
}

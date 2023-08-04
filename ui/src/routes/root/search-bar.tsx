import { InputAdornment, OutlinedInput, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ElementRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ query }: { query: string }) {
	const searchRef = useRef<ElementRef<'input'>>(null);
	const navigate = useNavigate();

	// Synchronize input value with the URL Search Params. We avoid making the Search input as Controlled Component
	// because it wound end up with more complexity for the same behavior.
	// You don't control the URL, the user does with the back/forward buttons.
	// There would be more synchronization points with a controlled component.
	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.value = query;
		}
	}, [query]);

	return (
		<SearcbarOutlinedInput
			size='small'
			inputRef={searchRef}
			type='search'
			endAdornment={
				<InputAdornment position='end'>
					<SearchIcon />
				</InputAdornment>
			}
			aria-label='Search clients'
			placeholder='Search clients...'
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
	);
}

const SearcbarOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		width: '35ch',
	},
}));

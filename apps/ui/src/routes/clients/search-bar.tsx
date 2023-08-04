import { InputAdornment, OutlinedInput, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEventHandler } from 'react';

export default function SearchBar(props: { value?: string; onChange?: ChangeEventHandler<HTMLInputElement> }) {
	return (
		<SearcbarOutlinedInput
			size='small'
			type='search'
			endAdornment={
				<InputAdornment position='end'>
					<SearchIcon />
				</InputAdornment>
			}
			aria-label='Search clients'
			placeholder='Search clients...'
			{...props}
		/>
	);
}

const SearcbarOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		width: '35ch',
	},
}));

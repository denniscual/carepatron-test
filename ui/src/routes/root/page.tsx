import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import {
	Button,
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import ClientTable from './ClientTable';
import { getClients } from 'services/api';
import { Search } from '@mui/icons-material';
import { ElementRef, useEffect, useRef } from 'react';

export default function Root() {
	const { clients, q } = useLoaderData() as LoaderData;
	const navigate = useNavigate();
	const searchRef = useRef<ElementRef<'input'>>(null);

	console.log({ clients, q });

	// Synchronize input value with the URL Search Params
	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.value = q;
		}
	}, [q]);

	return (
		<Stack gap={4}>
			<Typography variant='h1' sx={{ textAlign: 'start', fontSize: 'h4.fontSize' }} fontWeight={600}>
				Clients
			</Typography>
			<Stack gap={3.5}>
				<Stack direction='row' justifyContent='space-between'>
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
							defaultValue={q}
							onChange={(event) => {
								// Managing history stack
								const isFirstSearch = q === '';
								// Create new stack if the query is empty. Else, update the search params while replacing the current stack.
								// In this way, we can avoid polluting the history stack.
								navigate(`/?${new URLSearchParams({ q: event.currentTarget.value })}`, {
									replace: !isFirstSearch,
								});
							}}
						/>
					</FormControl>

					<Button size='small' variant='contained'>
						Create New Client
					</Button>
				</Stack>
				<Paper>
					<ClientTable clients={clients} />
				</Paper>
			</Stack>
		</Stack>
	);
}

type LoaderData = { clients: IClient[]; q: string };

/**
 * Use caching mechanism here to avoid sending unnecessary requests to the server.
 */
export const loader: LoaderFunction = async ({ request }) => {
	const clients = await getClients();
	const url = new URL(request.url);
	const q = url.searchParams.get('q') ?? '';

	return {
		clients,
		q,
	};
};

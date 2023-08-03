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
import { ElementRef, useEffect, useRef, useDeferredValue } from 'react';
import { searchItems } from 'lib/utils';

export default function Root() {
	const { clients, q } = useLoaderData() as LoaderData;
	const navigate = useNavigate();
	const searchRef = useRef<ElementRef<'input'>>(null);
	// NOTE: When dealing with huge volume of clients, its good to memoize the computation using `useMemo`.
	// But this will only be effective if the `loader` updates the reference in ideal way.
	// Let say, if the user didn't intent to change the `clients`, then loader should return same reference.
	const filteredClients = searchItems(clients, q, ['firstName', 'lastName']);
	// Defer the rendering of the Component that is relying to this data, in this case `ClientTable`, using Transition API.
	// Behind the scene, React will put lower priority to the depended Components. In this way, React can prioritize work that
	// has higher priority level like "user input". Using Transition API, main thread performance becomes effecient.
	const deferredClients = useDeferredValue(filteredClients);

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
								const { value } = event.currentTarget;
								// Managing history stack
								const isFirstSearch = q === '';
								// Create new stack if the query is empty. Else, update the search params while replacing the current stack.
								// In this way, we can avoid polluting the history stack.
								navigate(`/?${new URLSearchParams({ q: value })}`, {
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
					<ClientTable clients={deferredClients} />
				</Paper>
			</Stack>
		</Stack>
	);
}

type LoaderData = { clients: IClient[]; q: string };

/**
 * Use caching mechanism here to avoid sending unnecessary requests to the server. E.g, use react-query.
 */
export const loader: LoaderFunction = async ({ request }) => {
	const clients = await getClients();
	const url = new URL(request.url);
	const q = url.searchParams.get('q') ?? '';

	// Filter the clients based on the `query`.

	return {
		clients,
		q,
	};
};

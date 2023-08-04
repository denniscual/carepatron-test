import { LoaderFunction, useLoaderData, useNavigate, Outlet } from 'react-router-dom';
import { Button, Paper, Stack, Typography, styled } from '@mui/material';
import ClientTable from './client-table';
import { getClients } from 'services/api';
import { useDeferredValue } from 'react';
import { searchItems } from 'lib/utils';
import SearchBar from './search-bar';
import { Client } from 'lib/types';

type LoaderData = { clients: Client[]; q: string };

/**
 * Load the data once the route segment matches the URL path.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// In real-world app, you should use caching to efficiently handle the server state. E.g tools are react-query and useSwr.
	const clients = await getClients();
	const url = new URL(request.url);
	const q = url.searchParams.get('q') ?? '';
	return {
		clients,
		q,
	};
};

export default function Root() {
	const { clients, q } = useLoaderData() as LoaderData;
	// NOTE: When dealing with huge volume of clients, its good to memoize the computation using `useMemo`.
	// But this will only be effective if the `loader` updates the reference in ideal way.
	// Let say, if the user didn't intent to change the `clients`, then loader should return same reference.
	const filteredClients = searchItems(clients, q, ['firstName', 'lastName']);
	// Defer the rendering of the Component that is relying to this data, in this case `ClientTable`, using Transition API.
	// Behind the scene, React will put lower priority to the depended Components. In this way, React can prioritize work that
	// has higher priority level like "user input". Using Transition API, main thread performance becomes effecient.
	const deferredClients = useDeferredValue(filteredClients);
	const navigate = useNavigate();

	return (
		<>
			<Stack gap={4}>
				<Typography variant='h1' sx={{ textAlign: 'start', fontSize: 'h4.fontSize' }} fontWeight={600}>
					Clients
				</Typography>
				<Stack gap={3.5}>
					<SearchbarContainer>
						<SearchBar query={q} />
						<Button variant='contained' onClick={() => navigate('new')}>
							Create New Client
						</Button>
					</SearchbarContainer>
					<Paper>
						<ClientTable clients={deferredClients} />
					</Paper>
				</Stack>
			</Stack>
			<Outlet />
		</>
	);
}

const SearchbarContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	rowGap: theme.spacing(2),
	[theme.breakpoints.up('sm')]: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
}));

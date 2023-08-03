import { LoaderFunction, useLoaderData } from 'react-router-dom';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import ClientTable from './ClientTable';
import { getClients } from 'services/api';
import { useDeferredValue, useState } from 'react';
import { searchItems } from 'lib/utils';
import SearchBar from './search-bar';

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

	console.log({ clients, q });

	const [open, setOpen] = useState(false);

	return (
		<Stack gap={4}>
			<Typography variant='h1' sx={{ textAlign: 'start', fontSize: 'h4.fontSize' }} fontWeight={600}>
				Clients
			</Typography>
			<Stack gap={3.5}>
				<Stack direction='row' justifyContent='space-between'>
					<SearchBar query={q} />
					<Button variant='contained' onClick={() => setOpen(true)}>
						Create New Client
					</Button>
					<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='responsive-dialog-title'>
						<DialogTitle id='responsive-dialog-title'>{"Use Google's location service?"}</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Let Google help apps determine location. This means sending anonymous location data to
								Google, even when no apps are running.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)} variant='contained'>
								Continue
							</Button>
						</DialogActions>
					</Dialog>
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

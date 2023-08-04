import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'react-router-dom';
import { Button, Paper, Stack, Typography, styled } from '@mui/material';
import ClientTable from './client-table';
import { createClient, getClients } from 'services/api';
import { useDeferredValue, useState } from 'react';
import { generateId, searchItems } from 'lib/utils';
import SearchBar from './search-bar';
import { Client } from 'lib/types';
import CreateNewClientDialog from './create-new-client-dialog';

type LoaderData = { clients: Client[]; q: string };

/**
 * Load the data once the route segment matches the URL path.
 */
export const loader: LoaderFunction = async () => {
	// In real-world app, you should use caching to efficiently handle the server state. E.g tools are react-query and useSwr.
	const clients = await getClients();
	return {
		clients,
	};
};

/**
 * Do an action once the user submits a form action like POST, UPDATE, etc. The action will run if the route segment matches the URL path.
 * After the action completes, the data on the page is revalidated to capture any mutations that may have happened,
 * automatically keeping your UI in sync with your server state
 */
export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = await request.formData();
		const newClient = {
			...Object.fromEntries(formData),
			id: generateId(),
		} as Client;
		await createClient(newClient);
		return redirect('/clients');
	} catch (err) {
		throw err;
	}
};

export default function Root() {
	const [query, setQuery] = useState('');
	const { clients } = useLoaderData() as LoaderData;
	// Defer the rendering of the Component that is relying to this data, in this case `ClientTable`, using Transition API.
	// Behind the scene, React will put lower priority to the depended Components. In this way, React can prioritize work that
	// has higher priority level like "user input". Using Transition API, main thread performance becomes effecient.
	const filteredClients = searchItems(clients, query, ['firstName', 'lastName']);
	// Defer the rendering of the Component that is relying to this data, in this case `ClientTable`, using Transition API.
	// Behind the scene, React will put lower priority to the depended Components. In this way, React can prioritize work that
	// has higher priority level like "user input". Using Transition API, main thread performance becomes effecient.
	const deferredClients = useDeferredValue(filteredClients);

	return (
		<Stack gap={4}>
			<Typography variant='h1' sx={{ textAlign: 'start', fontSize: 'h4.fontSize' }} fontWeight={600}>
				Clients
			</Typography>
			<Stack gap={3.5}>
				<SearchbarContainer>
					<SearchBar value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
					<CreateNewClientDialogButtonTrigger />
				</SearchbarContainer>
				<Paper>
					<ClientTable clients={deferredClients} />
				</Paper>
			</Stack>
		</Stack>
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

function CreateNewClientDialogButtonTrigger() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant='contained' onClick={() => setOpen(true)}>
				Create New Client
			</Button>
			<CreateNewClientDialog
				maxWidth='sm'
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby='create-new-client-dialog-title'
			/>
		</>
	);
}

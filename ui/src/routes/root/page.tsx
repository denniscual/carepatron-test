import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import ClientTable from './ClientTable';
import { createClient, getClients } from 'services/api';
import { useDeferredValue, useState } from 'react';
import { generateId, searchItems } from 'lib/utils';
import SearchBar from './search-bar';
import CreateNewClientDialog from './create-new-client-dialog';

type LoaderData = { clients: IClient[]; q: string };

/**
 * Load the data once the route segment matches the URL path.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// In real-world scenario, you should use caching to efficiently handle the server state. E.g tools are react-query and useSwr.
	const clients = await getClients();
	const url = new URL(request.url);
	const q = url.searchParams.get('q') ?? '';
	return {
		clients,
		q,
	};
};

export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = await request.formData();
		const newClient = {
			...Object.fromEntries(formData),
			id: generateId(),
		} as IClient;
		switch (request.method) {
			case 'POST': {
				await createClient(newClient);
				return redirect('/');
			}
			default: {
				throw new Error('Unhandled action method.');
			}
		}
	} catch (err) {
		throw err;
	}
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

	console.log({ clients, q });

	return (
		<Stack gap={4}>
			<Typography variant='h1' sx={{ textAlign: 'start', fontSize: 'h4.fontSize' }} fontWeight={600}>
				Clients
			</Typography>
			<Stack gap={3.5}>
				<Stack direction='row' justifyContent='space-between'>
					<SearchBar query={q} />
					<CreateNewClientDialogButtonTrigger />
				</Stack>
				<Paper>
					<ClientTable clients={deferredClients} />
				</Paper>
			</Stack>
		</Stack>
	);
}

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

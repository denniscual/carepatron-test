import { Stack, Typography } from '@mui/material';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { getClient } from 'services/api';
import { Client } from 'lib/types';

type LoaderData = { client: Client };

export const loader: LoaderFunction = async ({ params }) => {
	try {
		// In real-world app, you should use caching to efficiently handle the server state. E.g tools are react-query and useSwr.
		const { id } = params;

		if (!id) {
			throw new Error('Client Id must be provided.');
		}

		const client = await getClient(id);
		return {
			client,
		};
	} catch (err) {
		throw err;
	}
};

export default function ClientDetails() {
	const { client } = useLoaderData() as LoaderData;

	return (
		<Stack>
			<Stack gap={1}>
				<Typography variant='h1' sx={{ fontSize: 'h5.fontSize' }} fontWeight={600}>
					{client.firstName} {client.lastName}
				</Typography>
				<Typography variant='body1'>{client.email}</Typography>
			</Stack>
		</Stack>
	);
}

import { Button, Stack, Typography } from '@mui/material';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
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
	const navigate = useNavigate();

	return (
		<Stack gap={2}>
			<div>
				<Typography variant='h1' sx={{ fontSize: 'h5.fontSize' }} fontWeight={600}>
					{client.firstName} {client.lastName}
				</Typography>
				<Typography variant='body1'>{client.email}</Typography>
				<Typography variant='body1'>{client.phoneNumber}</Typography>
			</div>
			<Stack direction='row' gap={1.5}>
				<Button variant='outlined' onClick={() => navigate('edit')}>
					Edit
				</Button>
				<Button variant='outlined' color='error'>
					Delete
				</Button>
			</Stack>
		</Stack>
	);
}

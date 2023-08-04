import { Paper, Stack } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { LoaderFunction } from 'react-router-dom';
import { getClient } from 'services/api';
import { Client } from 'lib/types';

export type LoaderData = { client: Client };

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

export default function ClientLayout() {
	return (
		<Paper
			sx={{
				maxWidth: 400,
				m: 'auto',
				p: 4,
			}}
		>
			<Stack gap={4}>
				<Link
					style={{
						fontSize: 14,
					}}
					to='..'
				>
					Back to list
				</Link>

				<Outlet />
			</Stack>
		</Paper>
	);
}

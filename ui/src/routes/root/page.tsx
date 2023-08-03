import { LoaderFunction, useLoaderData } from 'react-router-dom';
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

export default function Root() {
	const { clients, q } = useLoaderData() as LoaderData;

	console.log({ clients, q });

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
							id='search-clients'
							type='text'
							endAdornment={
								<InputAdornment position='end'>
									<Search />
								</InputAdornment>
							}
							label='Search clients...'
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

export const loader: LoaderFunction = async ({ request }) => {
	const clients = await getClients();
	const url = new URL(request.url);
	const q = url.searchParams.get('q') ?? '';

	return {
		clients,
		q,
	};
};

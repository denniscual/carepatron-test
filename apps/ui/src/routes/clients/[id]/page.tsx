import { Button, Stack, Typography } from '@mui/material';
import { Form, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { LoaderData } from './layout';

export default function ClientDetails() {
	const { client } = useRouteLoaderData('client') as LoaderData;
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
				<Form method='delete' action='destroy'>
					<input hidden type='text' name='clientId' defaultValue={client.id} />
					<Button variant='outlined' color='error' type='submit'>
						Delete
					</Button>
				</Form>
			</Stack>
		</Stack>
	);
}

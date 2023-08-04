import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Client } from 'lib/types';
import { Form } from 'react-router-dom';

export default function DeleteClient({ clientId }: { clientId: Client['id'] }) {
	return (
		<Form method='delete' action={`${clientId}/destroy`}>
			<input hidden type='text' name='clientId' defaultValue={clientId} />
			<IconButton aria-label='delete' size='small' color='error' type='submit'>
				<DeleteIcon fontSize='inherit' />
			</IconButton>
		</Form>
	);
}

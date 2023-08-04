import { Button, Stack } from '@mui/material';
import { TextField } from 'components/ui/textfield';
import { useNavigate } from 'react-router-dom';

export default function EditClient() {
	const navigate = useNavigate();

	return (
		<Stack gap={3}>
			<Stack gap={2}>
				<TextField autoFocus size='small' type='text' label='First name' />
				<TextField size='small' type='text' label='Last name' />
				<TextField size='small' type='email' label='Email' />
				<TextField size='small' type='email' label='Phone number' />
			</Stack>
			<Stack direction='row' gap={1.5}>
				<Button variant='outlined'>Save</Button>
				<Button variant='outlined' color='inherit' onClick={() => navigate('..')}>
					Cancel
				</Button>
			</Stack>
		</Stack>
	);
}

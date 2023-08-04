import { Button, Stack } from '@mui/material';
import { TextField } from 'components/ui/textfield';
import { Client } from 'lib/types';
import { FORM_FIELD_ERROR_MESSAGES } from 'lib/validation-message';
import {
	ActionFunction,
	Form,
	redirect,
	useActionData,
	useNavigate,
	useParams,
	useRouteLoaderData,
} from 'react-router-dom';
import { updateClient } from 'services/api';
import { LoaderData } from '../layout';

export const action: ActionFunction = async ({ request }) => {
	try {
		const errors: Record<string, string> = {};
		const formData = await request.formData();
		const values = Object.fromEntries(formData) as any as Client;

		if (values.firstName === '') {
			errors.firstName = FORM_FIELD_ERROR_MESSAGES.required;
		}
		if (values.lastName === '') {
			errors.lastName = FORM_FIELD_ERROR_MESSAGES.required;
		}
		if (values.email === '') {
			errors.email = FORM_FIELD_ERROR_MESSAGES.required;
		}
		if (values.phoneNumber === '') {
			errors.phoneNumber = FORM_FIELD_ERROR_MESSAGES.required;
		}

		if (Object.keys(errors).length) {
			return errors;
		}

		await updateClient(values);
		return redirect(`/clients/${values.id}`);
	} catch (err) {
		throw err;
	}
};

export default function EditClient() {
	const navigate = useNavigate();
	const errors = useActionData() ?? ({} as any);
	const { client } = useRouteLoaderData('client') as LoaderData;

	return (
		<Form method='post'>
			<Stack gap={3}>
				<Stack gap={2}>
					<input hidden name='id' defaultValue={client.id} />
					<TextField
						error={errors.firstName}
						autoFocus
						size='small'
						label='First name'
						name='firstName'
						defaultValue={client.firstName}
					/>
					<TextField
						error={errors.lastName}
						size='small'
						label='Last name'
						name='lastName'
						defaultValue={client.lastName}
					/>
					<TextField
						error={errors.email}
						size='small'
						type='email'
						label='Email'
						name='email'
						defaultValue={client.email}
					/>
					<TextField
						error={errors.phoneNumber}
						size='small'
						label='Phone number'
						name='phoneNumber'
						defaultValue={client.phoneNumber}
					/>
				</Stack>
				<Stack direction='row' gap={1.5}>
					<Button type='submit' variant='outlined'>
						Save
					</Button>
					<Button variant='outlined' color='inherit' onClick={() => navigate('..')}>
						Cancel
					</Button>
				</Stack>
			</Stack>
		</Form>
	);
}

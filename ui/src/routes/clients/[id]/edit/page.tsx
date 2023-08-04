import { Button, Stack } from '@mui/material';
import { TextField } from 'components/ui/textfield';
import { FORM_FIELD_ERROR_MESSAGES } from 'lib/validation-message';
import { ActionFunction, Form, useActionData, useNavigate } from 'react-router-dom';

export const action: ActionFunction = async ({ request }) => {
	try {
		const errors: Record<string, string> = {};
		const formData = await request.formData();
		const values = Object.fromEntries(formData);

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
	} catch (err) {
		throw err;
	}
};

export default function EditClient() {
	const navigate = useNavigate();
	const errors = useActionData() ?? ({} as any);

	return (
		<Form method='post'>
			<Stack gap={3}>
				<Stack gap={2}>
					<TextField
						error={errors.firstName}
						autoFocus
						size='small'
						type='text'
						label='First name'
						name='firstName'
					/>
					<TextField error={errors.lastName} size='small' type='text' label='Last name' name='lastName' />
					<TextField error={errors.email} size='small' type='email' label='Email' name='email' />
					<TextField
						error={errors.phoneNumber}
						size='small'
						type='email'
						label='Phone number'
						name='phoneNumber'
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

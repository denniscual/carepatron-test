import { ERROR_MESSAGES } from 'lib/error-messages';
import { ActionFunction, redirect } from 'react-router-dom';
import { deleteClient } from 'services/api/index';

export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = await request.formData();
		const clientId = formData.get('clientId');

		if (!clientId || typeof clientId !== 'string') {
			throw new Error(ERROR_MESSAGES.clientIdNotFound);
		}

		await deleteClient(clientId);
		return redirect('/clients');
	} catch (err) {
		throw err;
	}
};

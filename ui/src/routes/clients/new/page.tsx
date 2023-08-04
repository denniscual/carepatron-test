import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Step,
	StepLabel,
	Stepper,
	styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChangeEventHandler, ElementRef, ReactNode, useEffect, useRef, useState } from 'react';
import { TextField } from 'components/ui/textfield';
import { ActionFunction, redirect, useFormAction, useSubmit } from 'react-router-dom';
import { createFormData, generateId } from 'lib/utils';
import { FORM_FIELD_ERROR_MESSAGES } from 'lib/validation-message';
import { Client } from 'lib/types';
import { createClient } from 'services/api';

type ClientWithoutId = Omit<Client, 'id'>;

/**
 * Do an action once the user submits a form action like POST, UPDATE, etc. The action will run if the route segment matches the URL path.
 * After the action completes, the data on the page is revalidated to capture any mutations that may have happened,
 * automatically keeping your UI in sync with your server state
 */
export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = await request.formData();
		const newClient = {
			...Object.fromEntries(formData),
			id: generateId(),
		} as Client;
		await createClient(newClient);
		return redirect('/clients');
	} catch (err) {
		throw err;
	}
};

export default function NewClient() {
	const [open, setOpen] = useState(true);

	function onClose() {
		setOpen(false);
	}

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby='create-new-client-dialog-title' maxWidth='sm'>
			<CreateNewClientDialogTitle onClose={onClose} id='create-new-client-dialog-title'>
				Create New Client
			</CreateNewClientDialogTitle>
			<CreateNewClientDialogContent onNextFormContent={onClose} />
		</Dialog>
	);
}

function CreateNewClientDialogTitle(props: { id: string; children?: ReactNode; onClose?: () => void }) {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={{
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

function CreateNewClientDialogContent({ onNextFormContent }: { onNextFormContent?: () => void }) {
	// For form
	const [formFieldValues, setFormFieldValues] = useState<ClientWithoutId>({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
	});
	const [formFieldErrors, setFormFieldErrors] = useState({});
	const handleTextFieldChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const { name, value } = event.currentTarget;
		setFormFieldValues({
			...formFieldValues,
			[name]: value,
		});
	};
	const formAction = useFormAction();
	const submitForm = useSubmit();

	// For form content stepper
	const [activeFormContentStep, setActiveFormContentStep] = useState(0);
	function handleNextFormContent() {
		// Validate the form content before continuing.
		const errors = formContentSteps[activeFormContentStep].validateFormFieldValues(formFieldValues);
		// Set the errors or do a reset.
		setFormFieldErrors(errors);

		// Early exit if there are errors
		if (Object.keys(errors).length > 0) {
			return;
		}

		// If the user is on the last step, submit an action.
		if (activeFormContentStep === formContentSteps.length - 1) {
			onNextFormContent?.();
			submitForm(createFormData(formFieldValues), { action: formAction, method: 'POST' });
			return;
		}

		setActiveFormContentStep(activeFormContentStep + 1);
	}
	function handleBackFormContent() {
		setActiveFormContentStep(activeFormContentStep - 1);
	}
	const activeFormContent = (
		<FormContent
			values={formFieldValues}
			onChange={handleTextFieldChange}
			errors={formFieldErrors}
			formFields={formContentSteps[activeFormContentStep].formFields}
		/>
	);

	return (
		<>
			<DialogContent>
				<FormContentStepperContainer gap={3}>
					<FormContentStepper activeStep={activeFormContentStep} />
					{activeFormContent}
				</FormContentStepperContainer>
			</DialogContent>
			<DialogActions
				sx={{
					p: 3,
					mt: 1,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Button
					sx={{
						visibility: activeFormContentStep === 0 ? 'hidden' : 'visible',
					}}
					startIcon={<ArrowBackIcon />}
					variant='text'
					onClick={handleBackFormContent}
				>
					Back
				</Button>
				<Button variant='contained' onClick={handleNextFormContent}>
					{activeFormContentStep === formContentSteps.length - 1 ? 'Create Client' : 'Continue'}
				</Button>
			</DialogActions>
		</>
	);
}

const FormContentStepperContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		width: 500,
	},
}));

function FormContentStepper({ activeStep }: { activeStep: number }) {
	return (
		<Box>
			<Stepper activeStep={activeStep}>
				{formContentSteps.map((step) => {
					const stepProps: { completed?: boolean } = {};
					return (
						<Step key={step.value} {...stepProps}>
							<StepLabel>{step.label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
		</Box>
	);
}

type FormField = {
	id: string;
	name: keyof ClientWithoutId;
	label: string;
	autoFocus?: boolean;
};

const formContentSteps: {
	label: string;
	value: string;
	formFields: FormField[];
	validateFormFieldValues: (values: ClientWithoutId) => Record<string, string>;
}[] = [
	{
		label: 'Personal Details',
		value: 'personal',
		formFields: [
			{
				id: 'firstName-textfield',
				name: 'firstName',
				label: 'First name',
				autoFocus: true,
			},
			{
				id: 'lastName-textfield',
				name: 'lastName',
				label: 'Last name',
			},
		],
		validateFormFieldValues(values: ClientWithoutId) {
			const errors: Record<string, string> = {};
			if (values.firstName === '') {
				errors.firstName = FORM_FIELD_ERROR_MESSAGES.required;
			}
			if (values.lastName === '') {
				errors.lastName = FORM_FIELD_ERROR_MESSAGES.required;
			}
			if (Object.keys(errors).length) {
				return errors;
			}
			return {};
		},
	},
	{
		label: 'Contact Details',
		value: 'contact',
		formFields: [
			{
				id: 'email-textfield',
				name: 'email',
				label: 'Email',
				autoFocus: true,
			},
			{
				id: 'phoneNumber-textfield',
				name: 'phoneNumber',
				label: 'Phone number',
			},
		],
		validateFormFieldValues(values: ClientWithoutId) {
			const errors: Record<string, string> = {};
			if (values.email === '') {
				errors.email = FORM_FIELD_ERROR_MESSAGES.required;
			}
			if (values.phoneNumber === '') {
				errors.phoneNumber = FORM_FIELD_ERROR_MESSAGES.required;
			}
			if (Object.keys(errors).length) {
				return errors;
			}
			return {};
		},
	},
];

function FormContent({
	values,
	errors,
	onChange,
	formFields,
}: {
	values: Record<string, string>;
	errors: Record<string, string | undefined>;
	onChange?: ChangeEventHandler;
	formFields: FormField[];
}) {
	const inputRef = useRef<ElementRef<'input'>>(null);
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<Stack gap={2}>
			{formFields.map(({ name, ...textField }) => (
				<TextField
					ref={textField.autoFocus ? inputRef : null}
					key={name}
					{...textField}
					name={name}
					size='small'
					onChange={onChange}
					value={values[name]}
					error={errors[name]}
				/>
			))}
		</Stack>
	);
}

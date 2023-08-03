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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChangeEventHandler, ComponentProps, ReactNode, useState } from 'react';
import { TextField } from 'components/ui/textfield';
import { useFormAction, useSubmit } from 'react-router-dom';
import { createFormData } from 'lib/utils';

type Client = Omit<IClient, 'id'>;

export default function CreateNewClientDialog({
	onClose,
	...props
}: Omit<ComponentProps<typeof Dialog>, 'onClose'> & { onClose?: () => void }) {
	return (
		<Dialog {...props} onClose={onClose}>
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
	const [formFieldValues, setFormFieldValues] = useState<Client>({
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
			submitForm(createFormData(formFieldValues), { action: formAction, method: 'POST' });
			onNextFormContent?.();
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
				<Stack
					gap={3}
					sx={{
						width: 500,
					}}
				>
					<FormContentStepper activeStep={activeFormContentStep} />
					{activeFormContent}
				</Stack>
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

function FormContentStepper({ activeStep }: { activeStep: number }) {
	return (
		<Box sx={{ width: 500 }}>
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
	name: keyof Client;
	label: string;
};

const formContentSteps: {
	label: string;
	value: string;
	formFields: FormField[];
	validateFormFieldValues: (values: Client) => Record<string, string>;
}[] = [
	{
		label: 'Personal Details',
		value: 'personal',
		formFields: [
			{
				id: 'firstName-textfield',
				name: 'firstName',
				label: 'First name',
			},
			{
				id: 'lastName-textfield',
				name: 'lastName',
				label: 'Last name',
			},
		],
		validateFormFieldValues(values: Client) {
			const errors: Record<string, string> = {};
			if (values.firstName === '') {
				errors.firstName = ERROR_MESSAGES.required;
			}
			if (values.lastName === '') {
				errors.lastName = ERROR_MESSAGES.required;
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
			},
			{
				id: 'phoneNumber-textfield',
				name: 'phoneNumber',
				label: 'Phone number',
			},
		],
		validateFormFieldValues(values: Client) {
			const errors: Record<string, string> = {};
			if (values.email === '') {
				errors.email = ERROR_MESSAGES.required;
			}
			if (values.phoneNumber === '') {
				errors.phoneNumber = ERROR_MESSAGES.required;
			}
			if (Object.keys(errors).length) {
				return errors;
			}
			return {};
		},
	},
];

const ERROR_MESSAGES = {
	required: 'This field is required.',
	invalidEmail: 'Invalid email.',
};

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
	return (
		<Stack gap={2}>
			{formFields.map(({ name, ...input }) => (
				<TextField
					key={name}
					{...input}
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

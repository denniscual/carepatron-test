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

function CreateNewClientDialogContent({ onNextFormContent }: { onNextFormContent?: () => void }) {
	// For form
	const [formFieldValues, setFormFieldValues] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
	});
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
			errors={{}}
			textFields={formContentSteps[activeFormContentStep].textFields}
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

type FormTextField = {
	id: string;
	name: keyof Omit<IClient, 'id'>;
	label: string;
};

const formContentSteps: {
	label: string;
	value: string;
	textFields: FormTextField[];
}[] = [
	{
		label: 'Personal Details',
		value: 'personal',
		textFields: [
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
	},
	{
		label: 'Contact Details',
		value: 'contact',
		textFields: [
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
	},
];

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

function FormContent({
	values,
	errors,
	onChange,
	textFields,
}: {
	values: Record<string, string>;
	errors: Record<string, string | undefined>;
	onChange?: ChangeEventHandler;
	textFields: FormTextField[];
}) {
	return (
		<Stack gap={2}>
			{textFields.map(({ name, ...input }) => (
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

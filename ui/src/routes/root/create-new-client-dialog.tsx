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

export default function CreateNewClientDialog({
	onClose,
	...props
}: Omit<ComponentProps<typeof Dialog>, 'onClose'> & { onClose?: () => void }) {
	// For form content stepper
	const [activeFormContentStep, setActiveFormContentStep] = useState(0);
	function handleNextFormContent() {
		setActiveFormContentStep(activeFormContentStep + 1);
	}
	function handleBackFormContent() {
		setActiveFormContentStep(activeFormContentStep - 1);
	}
	const ActiveFormContent = steps[activeFormContentStep].Component;

	return (
		<Dialog {...props} onClose={onClose}>
			<CreateNewClientDialogTitle onClose={onClose} id='create-new-client-dialog-title'>
				Create New Client
			</CreateNewClientDialogTitle>
			<DialogContent>
				<Stack
					gap={3}
					sx={{
						width: 500,
					}}
				>
					<FormContentStepper activeStep={activeFormContentStep} />
					<ActiveFormContent values={{}} errors={{}} />
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
					{activeFormContentStep === steps.length - 1 ? 'Create Client' : 'Continue'}
				</Button>
			</DialogActions>
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

const steps: {
	label: string;
	value: string;
	Component: typeof PersonalDetailsFormContent;
}[] = [
	{
		label: 'Personal Details',
		value: 'personal',
		Component: PersonalDetailsFormContent,
	},
	{
		label: 'Contact Details',
		value: 'contact',
		Component: ContactDetailsFormContent,
	},
];

function PersonalDetailsFormContent({
	values,
	errors,
	onChange,
}: {
	values: Record<string, string>;
	errors: Record<string, string | undefined>;
	onChange?: ChangeEventHandler;
}) {
	const inputs = [
		{
			id: 'firstName-textfield',
			name: 'firstname',
			label: 'First name',
		},
		{
			id: 'lastName-textfield',
			name: 'lastname',
			label: 'Last name',
		},
	];

	return (
		<Stack gap={2}>
			{inputs.map(({ name, ...input }) => (
				<TextField
					key={name}
					{...input}
					size='small'
					onChange={onChange}
					value={values[name]}
					error={errors[name]}
				/>
			))}
		</Stack>
	);
}

function ContactDetailsFormContent({
	values,
	errors,
	onChange,
}: {
	values: Record<string, string>;
	errors: Record<string, string | undefined>;
	onChange?: ChangeEventHandler;
}) {
	const inputs = [
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
	];

	return (
		<Stack gap={2}>
			{inputs.map(({ name, ...input }) => (
				<TextField
					key={name}
					{...input}
					size='small'
					onChange={onChange}
					value={values[name]}
					error={errors[name]}
				/>
			))}
		</Stack>
	);
}

function FormContentStepper({ activeStep }: { activeStep: number }) {
	return (
		<Box sx={{ width: 500 }}>
			<Stepper activeStep={activeStep}>
				{steps.map((step) => {
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

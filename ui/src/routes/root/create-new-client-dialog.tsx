import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Step,
	StepLabel,
	Stepper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ComponentProps, ReactNode, useState } from 'react';

export default function CreateNewClientDialog({
	onClose,
	...props
}: Omit<ComponentProps<typeof Dialog>, 'onClose'> & { onClose?: () => void }) {
	const [activeFormContentStep, setActiveFormContentStep] = useState(0);

	const handleNextFormContent = () => {
		setActiveFormContentStep(activeFormContentStep + 1);
	};

	const handleBackFormContent = () => {
		setActiveFormContentStep(activeFormContentStep - 1);
	};

	return (
		<Dialog {...props} onClose={onClose}>
			<CreateNewClientDialogTitle onClose={onClose} id='create-new-client-dialog-title'>
				Create New Client
			</CreateNewClientDialogTitle>
			<DialogContent>
				<FormContentStepper activeStep={activeFormContentStep} />
				<div
					style={{
						width: 500,
					}}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					p: 3,
					mt: 3,
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

function FormContentStepper({ activeStep }: { activeStep: number }) {
	return (
		<Box sx={{ width: '100%' }}>
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

const steps = [
	{
		label: 'Personal Details',
		value: 'personal',
	},
	{
		label: 'Contact Details',
		value: 'contact',
	},
];

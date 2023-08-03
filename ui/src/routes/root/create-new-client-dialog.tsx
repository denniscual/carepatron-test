import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ComponentProps } from 'react';

export default function CreateNewClientDialog({
	onClose,
	...props
}: Omit<ComponentProps<typeof Dialog>, 'onClose'> & { onClose?: () => void }) {
	return (
		<Dialog {...props} onClose={onClose}>
			<CreateNewClientDialogTitle onClose={onClose} id='create-new-client-dialog-title'>
				{"Use Google's location service?"}
			</CreateNewClientDialogTitle>
			<DialogContent>
				<DialogContentText>
					Let Google help apps determine location. This means sending anonymous location data to Google, even
					when no apps are running.
				</DialogContentText>
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
				<Button startIcon={<ArrowBackIcon />} variant='text'>
					Back
				</Button>
				<Button onClick={onClose} variant='contained'>
					Continue
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function CreateNewClientDialogTitle(props: { id: string; children?: React.ReactNode; onClose?: () => void }) {
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

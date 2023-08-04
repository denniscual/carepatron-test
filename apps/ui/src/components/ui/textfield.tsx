import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { ComponentProps, forwardRef } from 'react';

export type TextFieldProps = {
	error?: string;
} & Omit<ComponentProps<typeof OutlinedInput>, 'error'>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ label, error, id, ...props }, ref) => {
	return (
		<FormControl error={!!error} variant='standard'>
			<InputLabel
				// Avoid setting error state to the input label.
				error={false}
				sx={{
					position: 'relative',
				}}
				shrink
				htmlFor={id}
			>
				{label}
			</InputLabel>
			<OutlinedInput inputRef={ref} id={id} {...props} />
			{!!error && <FormHelperText id='component-error-text'>{error}</FormHelperText>}
		</FormControl>
	);
});

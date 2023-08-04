import { Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function ClientLayout() {
	return (
		<Paper
			sx={{
				maxWidth: 'sm',
				m: 'auto',
				p: 4,
			}}
		>
			<Outlet />
		</Paper>
	);
}

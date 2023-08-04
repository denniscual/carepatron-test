import { Paper, Stack } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function ClientLayout() {
	return (
		<Paper
			sx={{
				maxWidth: 400,
				m: 'auto',
				p: 4,
			}}
		>
			<Stack gap={4}>
				<Link to='..'>Back to list</Link>

				<Outlet />
			</Stack>
		</Paper>
	);
}

import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

export default function Layout() {
	return (
		<Container
			sx={{
				height: '100%',
				py: 6,
			}}
			maxWidth='md'
		>
			<main>
				<Outlet />
			</main>
		</Container>
	);
}

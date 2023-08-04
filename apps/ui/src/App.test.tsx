import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/learn react/i);
	// @ts-expect-error @testing-library/jest-dom is not loaded properly
	expect(linkElement).toBeInTheDocument();
});

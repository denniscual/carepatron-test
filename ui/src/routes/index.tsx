import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Root, { loader as rootLoader } from './root';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Root />,
				loader: rootLoader,
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

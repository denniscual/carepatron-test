import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Root, { loader as rootLoader, action as rootAction } from './root/page';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Root />,
				loader: rootLoader,
				action: rootAction,
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

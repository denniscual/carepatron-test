import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Root from './root/page';
import Clients, { loader as clientsLoader } from './clients/page';
import NewClient, { action as newClientAction } from './clients/new/page';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Root />,
			},
			{
				path: 'clients',
				element: <Clients />,
				loader: clientsLoader,
				children: [
					{
						path: 'new',
						element: <NewClient />,
						action: newClientAction,
					},
				],
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

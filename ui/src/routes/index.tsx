import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Root from './root/page';
import Clients, { loader as clientsLoader, action as clientsAction } from './clients/page';
import Client from './clients/[id]/page';

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
				children: [
					{
						index: true,
						element: <Clients />,
						loader: clientsLoader,
						action: clientsAction,
					},
					{
						path: ':id',
						element: <Client />,
					},
				],
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

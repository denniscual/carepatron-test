import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Root from './root/page';
import Clients, { loader as clientsLoader, action as clientsAction } from './clients/page';
import Client, { loader as clientLoader } from './clients/[id]/page';
import { action as clientDestroyAction } from './clients/[id]/destroy.action';

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
						children: [
							{
								index: true,
								element: <Client />,
								loader: clientLoader,
							},
							{
								path: 'destroy',
								action: clientDestroyAction,
							},
						],
					},
				],
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './root/layout';
import Root from './root/page';
import Clients, { loader as clientsLoader, action as clientsAction } from './clients/page';
import Client, { loader as clientLoader } from './clients/[id]/page';
import { action as clientDestroyAction } from './clients/[id]/destroy.action';
import ClientLayout from './clients/[id]/layout';
import EditClient, { action as editClientAction } from './clients/[id]/edit/page';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Root />,
			},
			{
				path: 'clients',
				element: <Clients />,
				loader: clientsLoader,
				action: clientsAction,
			},
			{
				path: 'clients/:id',
				element: <ClientLayout />,
				children: [
					{
						index: true,
						element: <Client />,
						loader: clientLoader,
					},
					{
						path: 'edit',
						element: <EditClient />,
						action: editClientAction,
					},
					{
						path: 'clients/:id/destroy',
						action: clientDestroyAction,
					},
				],
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

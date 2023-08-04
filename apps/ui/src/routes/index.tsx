import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './root/layout';
import Root from './root/page';
import Clients, { loader as clientsLoader, action as clientsAction } from './clients/page';
import ClientLayout, { loader as clientLayoutLoader } from './clients/[id]/layout';
import Client from './clients/[id]/page';
import { action as clientDestroyAction } from './clients/[id]/destroy.action';
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
				id: 'client',
				path: 'clients/:id',
				element: <ClientLayout />,
				loader: clientLayoutLoader,
				children: [
					{
						index: true,
						element: <Client />,
					},
					{
						path: 'edit',
						element: <EditClient />,
						action: editClientAction,
					},
					{
						path: 'destroy',
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

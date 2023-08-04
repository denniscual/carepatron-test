import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClientRow from './ClientRow';

import { Fragment, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

export function BasicTable({ clients }: { clients: IClient[] }) {
	return (
		<TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
			<Table sx={{ minWidth: 400 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Phone number</TableCell>
						<TableCell>Email</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{clients.map((client) => (
						<ClientRow key={client.id} client={client} />
					))}
					{!clients ||
						(!clients.length && (
							<TableRow sx={{ padding: 3 }}>
								<TableCell component='th' scope='row'>
									No clients
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default function ClientTable({ clients }: { clients: IClient[] }) {
	return (
		<Paper style={{ height: 400, width: '100%' }}>
			<TableVirtuoso
				data={clients}
				components={VirtuosoTableComponents}
				fixedHeaderContent={fixedHeaderContent}
				itemContent={itemContent}
			/>
		</Paper>
	);
}

function itemContent(_index: number, row: IClient) {
	return (
		<Fragment>
			{columns.map(({ dataKey }) => {
				// @ts-expect-error
				const value = row[dataKey];
				if (dataKey === 'name') {
					return (
						<TableCell key={dataKey} component='th' scope='row'>
							{row.firstName} {row.lastName}
						</TableCell>
					);
				}
				return <TableCell key={dataKey}>{value}</TableCell>;
			})}
		</Fragment>
	);
}

function fixedHeaderContent() {
	return (
		<TableRow>
			{columns.map((column) => (
				<TableCell
					key={column.dataKey}
					variant='head'
					sx={{
						backgroundColor: 'background.paper',
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	);
}

const VirtuosoTableComponents: TableComponents<IClient> = {
	Scroller: forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
	Table: (props: any) => (
		<Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} aria-label='simple table' />
	),
	TableHead,
	TableRow,
	TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

const columns = [
	{
		dataKey: 'name',
		label: 'Name',
	},
	{
		dataKey: 'phoneNumber',
		label: 'Phone Number',
	},
	{
		dataKey: 'email',
		label: 'Email',
	},
];

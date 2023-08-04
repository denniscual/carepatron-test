import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Fragment, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

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

export default function ClientTable({ clients }: { clients: IClient[] }) {
	return (
		<Paper style={{ height: 450, width: '100%' }}>
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
				const value = row[dataKey as keyof IClient];
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
	Table: (props) => (
		<Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} aria-label='Client Table' />
	),
	TableHead,
	TableRow,
	TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
	EmptyPlaceholder: function EmptyPlaceholder() {
		return (
			<TableRow>
				<TableCell component='th' scope='row' colSpan={3}>
					No clients
				</TableCell>
			</TableRow>
		);
	},
};

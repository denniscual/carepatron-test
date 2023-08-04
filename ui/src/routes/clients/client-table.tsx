import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Fragment, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { Client } from 'lib/types';
import { IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

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
	{
		dataKey: 'actions',
		label: '',
	},
];

export default function ClientTable({ clients }: { clients: Client[] }) {
	return (
		<Paper style={{ height: 450, width: '100%' }}>
			<TableVirtuoso
				data={clients}
				components={VirtuosoTableComponents}
				fixedHeaderContent={fixedHeaderContent}
				itemContent={rowContent}
			/>
		</Paper>
	);
}

function rowContent(_index: number, row: Client) {
	return (
		<Fragment>
			{columns.map(({ dataKey }) => {
				if (dataKey === 'actions') {
					return (
						<TableCell key={dataKey}>
							<Stack direction='row' rowGap={2} justifyContent='space-evenly' alignItems='center'>
								<EditLink path={row.id} />
								<IconButton aria-label='delete' size='small' color='error'>
									<DeleteIcon fontSize='inherit' />
								</IconButton>
							</Stack>
						</TableCell>
					);
				}

				if (dataKey === 'name') {
					return (
						<TableCell
							key={dataKey}
							component='th'
							scope='row'
							sx={{
								color: 'primary.main',
								fontWeight: 'bold',
							}}
						>
							{row.firstName} {row.lastName}
						</TableCell>
					);
				}

				const value = row[dataKey as keyof Client];
				return <TableCell key={dataKey}>{value}</TableCell>;
			})}
		</Fragment>
	);
}

function EditLink({ path }: { path: string }) {
	const navigate = useNavigate();

	return (
		<IconButton aria-label='delete' size='small' onClick={() => navigate(path)}>
			<EditIcon fontSize='inherit' />
		</IconButton>
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
						fontWeight: 'bold',
						backgroundColor: 'white',
						'&:last-child': { width: 70 },
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	);
}

const VirtuosoTableComponents: TableComponents<Client> = {
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
				<TableCell component='th' scope='row' colSpan={columns.length}>
					No clients
				</TableCell>
			</TableRow>
		);
	},
};

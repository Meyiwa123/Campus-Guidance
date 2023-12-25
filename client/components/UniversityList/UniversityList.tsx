import './UniversityList.scss';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

export interface UniversityData {
  academic_level: string;
  program_name: string;
  program_type: string;
  program_duration: string;
  duration_of_term: string;
  institution_name: string;
  contact_person: string;
  contact_email: string;
}

interface ColumnData {
  dataKey: keyof UniversityData;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  { width: 200, label: 'Academic Level', dataKey: 'academic_level' },
  { width: 200, label: 'Program Name', dataKey: 'program_name' },
  { width: 100, label: 'Program Type', dataKey: 'program_type' },
  { width: 125, label: 'Program Duration', dataKey: 'program_duration' },
  { width: 125, label: 'Duration of Term', dataKey: 'duration_of_term' },
  { width: 200, label: 'Institution Name', dataKey: 'institution_name' },
  { width: 200, label: 'Contact Person', dataKey: 'contact_person' },
  { width: 200, label: 'Contact Email', dataKey: 'contact_email' },
];

const VirtuosoTableComponents: TableComponents<UniversityData> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
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

function rowContent(_index: number, row: UniversityData) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function UniversityList({ universities }: { universities: UniversityData[] }) {
  return (
    <>
      <div>
        <h1>University List</h1>
        <p>Thank you for completing the questions! Here is the information about the universities:</p>
        <p>🌐 Explore the diverse academic opportunities provided by these institutions.</p>
      </div>
      <Paper style={{ height: 400, width: '100%' }}>
          <TableVirtuoso
            data={universities}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent} />
      </Paper>
      <button className='restart-button' onClick={() => window.location.reload()}>Restart</button>
    </>
  );
}

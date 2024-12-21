import {
  DataGrid,
  GridActionsCellItemProps,
  GridColDef,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { ReactElement } from 'react';

interface DataListTableProps<T, Q> {
  rows: T[];
  columns: Q[];
  getActions: (
    params: GridRowParams<any>,
  ) => readonly ReactElement<GridActionsCellItemProps>[];
}
const DataListTable = function <
  T extends GridValidRowModel,
  Q extends GridColDef,
>({ rows, columns, getActions }: DataListTableProps<T, Q>) {
  return (
    <DataGrid
      rows={rows}
      columns={[
        ...columns,
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 100,
          getActions,
        },
      ]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};

export default DataListTable;

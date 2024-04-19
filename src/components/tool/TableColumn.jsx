//Importy zewnętrzne
import { IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
//Importy lokalne
import styles from './css/TableColumn.module.css';

export const TableColumn = (onDelete, onAddToBox) => {
  return [
    {
      Header: 'TOOL NAME',
      accessor: 'name' // accessor is the "key" in the data
    },
    {
      Header: 'DIAMETER (mm)',
      accessor: 'dc', // accessor is the "key" in the data
      Cell: ({ row }) => (row.original.dc > 0 ? `Φ${row.original.dc}` : 'N/A')
    },

    {
      Header: 'OAL (mm)',
      accessor: 'oal',
      Cell: ({ row }) => (row.original.oal > 0 ? row.original.oal : 'N/A')
    },

    {
      Header: 'CFL (mm)',
      accessor: 'cfl',
      Cell: ({ row }) => (row.original.cfl > 0 ? row.original.cfl : 'N/A')
    },

    {
      Header: 'QUANTITY',
      accessor: 'quantity',
      Cell: ({ row }) => {
        if (row.original.quantity < row.original.minQuantity)
          return (
            <div className={styles.error}>
              {row.original.quantity}
              <Tooltip title="Quantity is less than min. quantity" arrow>
                <ReportGmailerrorredIcon />
              </Tooltip>
              {row.original.quantityInTransit > 0 ? (
                <Tooltip title={'Ordered: ' + row.original.quantityInTransit + 'x'} arrow>
                  <LocalShippingOutlinedIcon color="success" />
                </Tooltip>
              ) : (
                ''
              )}
            </div>
          );
        else
          return (
            <div className={styles.quantity}>
              {row.original.quantity}
              {row.original.quantityInTransit > 0 ? (
                <Tooltip title={'Ordered: ' + row.original.quantityInTransit + 'x'} arrow>
                  <LocalShippingOutlinedIcon color="success" />
                </Tooltip>
              ) : (
                ''
              )}
            </div>
          );
      }
    },

    {
      Header: 'Min. QUANTITY',
      accessor: 'minQuantity'
    },

    {
      Header: 'INVENTORY DATE',
      accessor: 'updatedOn'
    },

    {
      Header: 'ACTION',
      accessor: 'id',
      Cell: ({ cell }) => (
        <div className={styles.action_btn_wrapper}>
          <Tooltip title="Add tool to box">
            <IconButton onClick={() => onAddToBox(cell.value)}>
              <AddBoxOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(cell.value)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];
};

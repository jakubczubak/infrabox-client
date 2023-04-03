import React from 'react';
import { Typography, TextField, InputAdornment, Tooltip, Breadcrumbs } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import styles from './css/SupplierList.module.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supplierManager } from './service/supplierManager';
import { SupplierItem } from './SupplierItem';

export const SupplierList = () => {
  const [query, setQuery] = React.useState('');
  const { data, isLoading, isError } = useQuery(['suppliers'], supplierManager.getSupplierList); // fetch all supliers

  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>
        <Typography color="text.primary">Suppliers</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Manage Suppliers
        </Typography>
      </div>
      <Tooltip title="Search" placement="right">
        <TextField
          variant="standard"
          onChange={(e) => setQuery(e.target.value)}
          label="Search"
          InputProps={{
            className: styles.search_input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        ></TextField>
      </Tooltip>
      <SpeedDial
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        ariaLabel="Navigation speed dial"
        sx={speedDialStyles}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="New supplier"
          onClick={() => navigate('/supplier/new')}
        />
      </SpeedDial>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      <div className={styles.supplierList}>
        {data && data.length > 0 ? (
          data
            .filter((item) => {
              if (query === '') {
                return item;
              } else if (
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.surname.toLowerCase().includes(query.toLowerCase()) ||
                item.companyName.toLowerCase().includes(query.toLowerCase()) ||
                item.tagList.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
              ) {
                return item;
              }
            })
            .map((item) => {
              return <SupplierItem key={item.id} item={item} />;
            })
        ) : (
          <div className={styles.no_suppliers}>
            <Typography variant="h6" component="div">
              No suppliers found
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

const speedDialStyles = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1
};

//Importy zewnętrzne
import React from 'react';
import {
  Breadcrumbs,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  SpeedDialIcon,
  SpeedDial,
  SpeedDialAction
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
//Importy lokalne
import styles from './css/OrderList.module.css';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { orderManager } from './service/orderManager';
import { OrderTable } from './OrderTable';

const speedDialStyles = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1
};

export const OrderList = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError } = useQuery(['order'], orderManager.getOrderList); // fetch all calcualiions
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>
        <Typography color="text.primary">Orders</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Manage orders
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
          tooltipTitle="Create order"
          onClick={() => navigate('/order/new')}
        />
      </SpeedDial>
      {isLoading && <Loader />}
      {isError && <Error message={'Failed to fetch orders. Please try again later!'} />}
      {data && (
        <OrderTable
          orderList={data.filter((order) => {
            if (query === '') return order;
            else if (order.name.toLowerCase().includes(query.toLowerCase())) return order;
          })}
        />
      )}
    </div>
  );
};

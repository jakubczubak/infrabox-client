// Importy zewnętrzne
import React, { useState } from 'react';
import {
  Breadcrumbs,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Importy lokalne
import { WTCList } from './WTCList';
import { recycleManager } from './service/recycleManager';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import styles from './css/RecycleList.module.css';

const speedDialStyles = { position: 'fixed', bottom: 16, right: 16, zIndex: 1 };

export const RecycleList = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError } = useQuery(['recycle'], recycleManager.getRecycleList);
  const navigate = useNavigate();

  const filterItems = (item) => {
    const lowerCaseQuery = query.toLowerCase();
    return (
      query === '' ||
      item.company.toLowerCase().includes(lowerCaseQuery) ||
      item.totalPrice.toString().toLowerCase().includes(lowerCaseQuery) ||
      item.date.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>
        <Typography color="text.primary">Recycling</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Recycling
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
        />
      </Tooltip>
      <SpeedDial
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        ariaLabel="Navigation speed dial"
        sx={speedDialStyles}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Create waste transfer card"
          onClick={() => navigate('/recycling/wtc')}
        />
      </SpeedDial>
      {isLoading && <Loader />}
      {isError && (
        <Error message={'Failed to fetch waste transfer cards. Please try again later!'} />
      )}
      {data && <WTCList item={data.filter(filterItems)} />}
    </>
  );
};

import React from 'react';
import styles from './css/RecycleList.module.css';
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
import Lottie from 'lottie-react';
import animation from '../../assets/Lottie/recycle.json';
import { useNavigate } from 'react-router-dom';
import { WTCList } from './WTCList';
import { useQuery } from '@tanstack/react-query';
import { recycleManager } from './service/recycleManager';

export const RecycleList = () => {
  const [query, setQuery] = React.useState('');
  const { data, isLoading, isError } = useQuery(['materials'], recycleManager.getRecycleList); // fetch all materials

  let navigate = useNavigate();

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}>
        <Typography color="text.primary">...</Typography>
        <Typography color="text.primary">Recycling</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Recycling
        </Typography>
        <Lottie animationData={animation} loop={true} className={styles.animation} />
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
          }}></TextField>
      </Tooltip>

      <SpeedDial
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        ariaLabel="Navigation speed dial"
        sx={speedDialStyles}>
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="WTC Form"
          onClick={() => navigate('/recycling/wtc')}
        />
      </SpeedDial>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && (
        <WTCList
          onEdit={() => {
            console.log('edit');
          }}
          onDelete={() => {
            console.log('delete');
          }}
          item={data.filter((item) => {
            if (query === '') {
              return item;
            } else if (
              item.receiver.toLowerCase().includes(query.toLowerCase()) ||
              item.value.toString().toLowerCase().includes(query.toLowerCase()) ||
              item.date.toLowerCase().includes(query.toLowerCase())
            ) {
              return item;
            }
          })}
        />
      )}
    </>
  );
};

const speedDialStyles = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1
};
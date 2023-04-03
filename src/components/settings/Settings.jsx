import React from 'react';
import styles from './css/Settings.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Breadcrumbs, Typography } from '@mui/material';
import { useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { UserList } from './UserList';
import { UserDetails } from './UserDetails';
import { showNotification } from '../../components/common/service/showNotification';
import { useDispatch } from 'react-redux';

export const Settings = () => {
  const [value, setValue] = useState('1');

  const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    if (userFromLocalStorage.role === 'user') {
      showNotification('Access denied!', 'error', dispatch);
      return;
    }
    setValue(newValue);
  };
  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<Typography color="text.primary">/</Typography>}
      >
        <Typography color="text.primary">...</Typography>

        <Typography color="text.primary">Settings</Typography>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography variant="h5" component="div">
          Settings
        </Typography>
      </div>

      <div className={styles.settings_container}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Tabs example">
              <Tab label="My profile" value="1" />
              <Tab
                label="Users list"
                value="2"
                icon={<AdminPanelSettingsIcon />}
                iconPosition="end"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <UserDetails />
          </TabPanel>
          <TabPanel value="2">
            <UserList />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
};

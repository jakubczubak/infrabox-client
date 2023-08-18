import React from 'react';
import styles from './css/Settings.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Breadcrumbs, Typography } from '@mui/material';
import { useState } from 'react';
import { UserList } from './UserList';
import { UserDetails } from './UserDetails';
import { showNotification } from '../../components/common/service/showNotification';
import { useDispatch } from 'react-redux';
import { Contact } from './Contact';
import { DepartmentCost } from './DepartmentCost';
import { departmentCostManager } from './service/departmentCostManager';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const Settings = ({ tab }) => {
  const [value, setValue] = useState(tab ? tab : '1');

  const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

  const { data, isLoading, isError } = useQuery(
    ['defaultDepartmentCost'],
    departmentCostManager.getDefaultDepartmentCost
  ); // fetch default department cost

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
        separator={<Typography color="text.primary">/</Typography>}>
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
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile>
              <Tab label="My profile" value="1" icon={<BadgeOutlinedIcon />} iconPosition="end" />
              <Tab label="User list" value="2" icon={<GppGoodOutlinedIcon />} iconPosition="end" />
              <Tab
                label="Department cost"
                value="3"
                icon={<SettingsApplicationsOutlinedIcon />}
                iconPosition="end"
              />
              <Tab label="About" value="4" icon={<InfoOutlinedIcon />} iconPosition="end" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <UserDetails />
          </TabPanel>
          <TabPanel value="2">
            <UserList />
          </TabPanel>

          <TabPanel value="3">
            {isLoading && <Loader />}
            {isError && <Error message={'Error fetch department cost. Please try again later!'} />}
            {data && !isError && !isError && <DepartmentCost defaultValues={data} />}
          </TabPanel>

          <TabPanel value="4">
            <Contact />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
};
